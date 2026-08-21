import React, { useState, useEffect, useRef } from 'react';
import { 
  AppViewMode, 
  DemoStep, 
  DisasterType, 
  EvacuationRoute, 
  EvacuationZoneType, 
  GroundTruthReport, 
  PredictionResult, 
  ResponderUnit, 
  SensorStation, 
  Shelter, 
  SupportedLanguage, 
  TelemetryPoint 
} from './types';
import { 
  calculateAiPrediction, 
  DEFAULT_EPICENTERS, 
  INITIAL_STATIONS, 
  INITIAL_SHELTERS, 
  INITIAL_RESPONDERS 
} from './utils/aiPredictor';
import { computeEvacuationCorridors } from './utils/routingEngine';
import { generateTelemetryReading } from './utils/iotStream';
import { playEmergencySiren, playSafeCheckinChime, speakEmergencyText } from './utils/soundEffects';
import { TRANSLATIONS } from './utils/translations';
import { Navbar } from './components/Navbar';
import { DemoControllerBar } from './components/DemoControllerBar';
import { CommandCenter } from './components/CommandCenter/CommandCenter';
import { CitizenApp } from './components/CitizenApp/CitizenApp';
import { DisasterTriggerModal } from './components/CommandCenter/DisasterTriggerModal';
import { PostEventReportModal } from './components/CommandCenter/PostEventReportModal';

export default function App() {
  // Navigation & Language State
  const [viewMode, setViewMode] = useState<AppViewMode>('COMMAND_CENTER');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');

  // Simulation & Demo Flow State
  const [currentStep, setCurrentStep] = useState<DemoStep>('STEP_1_NORMAL');
  const [isDisasterActive, setIsDisasterActive] = useState<boolean>(false);
  const [disasterType, setDisasterType] = useState<DisasterType>('earthquake');
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Tactical Core State
  const [sensorStations, setSensorStations] = useState<SensorStation[]>(INITIAL_STATIONS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [responders, setResponders] = useState<ResponderUnit[]>(INITIAL_RESPONDERS);
  const [groundReports, setGroundReports] = useState<GroundTruthReport[]>([]);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);

  // AI & Routing State
  const [prediction, setPrediction] = useState<PredictionResult>(() =>
    calculateAiPrediction('earthquake', false)
  );
  const [activeRoutes, setActiveRoutes] = useState<EvacuationRoute[]>(() =>
    computeEvacuationCorridors(
      DEFAULT_EPICENTERS.earthquake,
      INITIAL_SHELTERS,
      [],
      'ALPHA'
    )
  );

  // Background Telemetry Simulation Loop
  useEffect(() => {
    // Generate initial history
    const initialHistory: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      initialHistory.push(
        generateTelemetryReading(disasterType, isDisasterActive, now - i * 1500)
      );
    }
    setTelemetryHistory(initialHistory);

    const interval = setInterval(() => {
      const reading = generateTelemetryReading(disasterType, isDisasterActive);
      setTelemetryHistory((prev) => {
        const next = [...prev.slice(-24), reading];
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [disasterType, isDisasterActive]);

  // Recalculate AI Prediction & Routes on disaster change or step transition
  const handleTriggerDisaster = (type: DisasterType, customLocation?: string) => {
    setDisasterType(type);
    setIsDisasterActive(true);
    setCurrentStep('STEP_2_THREAT');

    const epicenter = DEFAULT_EPICENTERS[type];
    const newPrediction = calculateAiPrediction(type, true);
    setPrediction(newPrediction);

    const routes = computeEvacuationCorridors(
      epicenter,
      shelters,
      groundReports,
      'ALPHA'
    );
    setActiveRoutes(routes);

    playEmergencySiren(2.5);
    const alertMsg = `Emergency Warning: ${newPrediction.magnitudeOrSeverity} detected near ${epicenter.name}. Evacuation corridors active.`;
    speakEmergencyText(alertMsg, selectedLanguage);
  };

  // Demo Controller Steps
  const handleStepChange = (step: DemoStep) => {
    setCurrentStep(step);

    switch (step) {
      case 'STEP_1_NORMAL':
        setIsDisasterActive(false);
        setPrediction(calculateAiPrediction(disasterType, false));
        break;

      case 'STEP_2_THREAT':
        setIsDisasterActive(true);
        setPrediction(calculateAiPrediction(disasterType, true));
        break;

      case 'STEP_3_PREDICTION':
        setIsDisasterActive(true);
        const pred3 = calculateAiPrediction(disasterType, true);
        pred3.threatLevel = 'EXTREME';
        pred3.probabilityScore = 94.2;
        setPrediction(pred3);
        playEmergencySiren(2);
        break;

      case 'STEP_4_PANIC_PREVENTION':
        setIsDisasterActive(true);
        const routes = computeEvacuationCorridors(
          prediction.epicenter,
          shelters,
          groundReports,
          'ALPHA'
        );
        setActiveRoutes(routes);
        break;
    }
  };

  const handleResetSimulation = () => {
    setIsDisasterActive(false);
    setCurrentStep('STEP_1_NORMAL');
    setGroundReports([]);
    setPrediction(calculateAiPrediction(disasterType, false));
    setShelters(INITIAL_SHELTERS);
    setResponders(INITIAL_RESPONDERS);
  };

  // Dispatch tactical responder unit
  const handleDispatchUnit = (unitId: string, targetZone: EvacuationZoneType) => {
    setResponders((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? { ...u, status: 'DISPATCHED', assignedZone: targetZone, etaMinutes: 4 }
          : u
      )
    );
  };

  // Transmit multi-channel broadcast
  const handleBroadcastAlert = (channels: string[]) => {
    playEmergencySiren(3);
    const text = TRANSLATIONS[selectedLanguage].zoneAlphaAlert;
    speakEmergencyText(text, selectedLanguage);
  };

  // Crowdsource hazard report from citizen
  const handleReportHazard = (report: Partial<GroundTruthReport>) => {
    const newReport: GroundTruthReport = {
      id: `rep-${Date.now()}`,
      timestamp: Date.now(),
      citizenName: report.citizenName || 'Resident Field Scout',
      type: report.type || 'ROAD_BLOCK',
      location: report.location || {
        lat: prediction.epicenter.lat + 0.01,
        lng: prediction.epicenter.lng - 0.01,
        landmark: 'Reported Junction',
      },
      description: report.description || 'Observed hazard',
      severity: 'HIGH',
      verified: true,
    };

    setGroundReports((prev) => [newReport, ...prev]);

    // Reroute active corridors immediately around hazard
    const updatedRoutes = computeEvacuationCorridors(
      prediction.epicenter,
      shelters,
      [newReport, ...groundReports],
      'ALPHA'
    );
    setActiveRoutes(updatedRoutes);
  };

  // Emergency SOS trigger from citizen
  const handleTriggerSos = () => {
    playEmergencySiren(4);
    // Dispatch closest available responder
    const available = responders.find((r) => r.status === 'AVAILABLE');
    if (available) {
      handleDispatchUnit(available.id, 'ALPHA');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E4E4E7] flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Application Navbar */}
      <Navbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        isDisasterActive={isDisasterActive}
        threatLevel={prediction.threatLevel}
        onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Scripted 4-Step Demo Controller Bar */}
      <DemoControllerBar
        currentStep={currentStep}
        onSelectStep={handleStepChange}
        disasterType={disasterType}
        onTriggerDisaster={(type) => handleTriggerDisaster(type)}
        onResetSimulation={handleResetSimulation}
        isDisasterActive={isDisasterActive}
        onOpenTriggerModal={() => setIsTriggerModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 flex flex-col">
        {viewMode === 'COMMAND_CENTER' && (
          <CommandCenter
            prediction={prediction}
            isDisasterActive={isDisasterActive}
            disasterType={disasterType}
            sensorStations={sensorStations}
            telemetryHistory={telemetryHistory}
            shelters={shelters}
            responders={responders}
            groundReports={groundReports}
            activeRoutes={activeRoutes}
            onDispatchUnit={handleDispatchUnit}
            onBroadcastAlert={handleBroadcastAlert}
          />
        )}

        {viewMode === 'CITIZEN' && (
          <CitizenApp
            prediction={prediction}
            isDisasterActive={isDisasterActive}
            disasterType={disasterType}
            selectedLanguage={selectedLanguage}
            activeRoutes={activeRoutes}
            shelters={shelters}
            onReportHazard={handleReportHazard}
            onTriggerSos={handleTriggerSos}
          />
        )}

        {viewMode === 'DUAL' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left: Command Center (7 cols) */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              <div className="bg-[#18181B] p-3 rounded-2xl border border-[#27272A] flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
                  COMMAND CENTER VIEW (OPERATOR DESK)
                </span>
                <span className="text-[10px] font-mono bg-black px-2.5 py-0.5 rounded-lg text-[#71717A] border border-[#27272A]">
                  DESKTOP / TABLET
                </span>
              </div>
              <CommandCenter
                prediction={prediction}
                isDisasterActive={isDisasterActive}
                disasterType={disasterType}
                sensorStations={sensorStations}
                telemetryHistory={telemetryHistory}
                shelters={shelters}
                responders={responders}
                groundReports={groundReports}
                activeRoutes={activeRoutes}
                onDispatchUnit={handleDispatchUnit}
                onBroadcastAlert={handleBroadcastAlert}
              />
            </div>

            {/* Right: Citizen Mobile View (5 cols) */}
            <div className="xl:col-span-5 flex flex-col items-center">
              <div className="w-full bg-[#18181B] p-3 rounded-2xl border border-[#27272A] flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-green-400 uppercase tracking-wider">
                  CITIZEN MOBILE VIEW (RESIDENT APP)
                </span>
                <span className="text-[10px] font-mono bg-black px-2.5 py-0.5 rounded-lg text-[#71717A] border border-[#27272A]">
                  ANDROID / IOS
                </span>
              </div>
              <CitizenApp
                prediction={prediction}
                isDisasterActive={isDisasterActive}
                disasterType={disasterType}
                selectedLanguage={selectedLanguage}
                activeRoutes={activeRoutes}
                shelters={shelters}
                onReportHazard={handleReportHazard}
                onTriggerSos={handleTriggerSos}
              />
            </div>

          </div>
        )}
      </main>

      {/* Presenter Disaster Scenario Trigger Modal */}
      <DisasterTriggerModal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        onTrigger={handleTriggerDisaster}
      />

      {/* Post-Event Digital After-Action Report Modal */}
      <PostEventReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        prediction={prediction}
      />

    </div>
  );
}
