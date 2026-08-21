import { DisasterType, PredictionResult, SensorStation, ThreatLevel, XaiFeatureImpact } from '../types';

export const DEFAULT_EPICENTERS: Record<DisasterType, { lat: number; lng: number; name: string; severity: string; pop: number }> = {
  earthquake: {
    lat: 37.7749,
    lng: -122.4194,
    name: 'San Andreas Fault Segment IV (Hayward Fault System)',
    severity: 'Magnitude 7.4 Megathrust Strike-Slip',
    pop: 142000,
  },
  wildfire: {
    lat: 37.7920,
    lng: -122.3950,
    name: 'East Ridge Canyon & Pine Forest Reserve',
    severity: 'Extreme Fast-Moving Firefront (Cat 5 Pyro-convective)',
    pop: 68500,
  },
  volcano: {
    lat: 37.7580,
    lng: -122.4400,
    name: 'Mount Sentinel Volcanic Caldera Rift',
    severity: 'VEI-4 Sub-Plinian Pyroclastic Surge',
    pop: 94000,
  },
  tsunami: {
    lat: 37.8100,
    lng: -122.4780,
    name: 'Offshore Subduction Trench Fault Trench A-9',
    severity: '14.2m Coastal Tsunami Wave Crest Train',
    pop: 180000,
  },
  tornado: {
    lat: 37.7650,
    lng: -122.4100,
    name: 'Central Metro Corridor Supercell Mesocyclone',
    severity: 'EF-4 Multi-Vortex Tornado (280 km/h)',
    pop: 110000,
  },
  cyclone: {
    lat: 37.7850,
    lng: -122.4600,
    name: 'Maritime Coastal Cyclone Vortex (Super Storm Level 4)',
    severity: '195 km/h Sustained Winds + 4.5m Storm Surge',
    pop: 215000,
  },
};

export function predictDisasterRisk(
  type: DisasterType,
  stations: SensorStation[],
  isElevatedSimulation = false
): PredictionResult {
  const epic = DEFAULT_EPICENTERS[type];

  // Calculate average sensor anomalies
  const avgSeismic = stations.reduce((acc, s) => acc + s.readings.seismicAccelG, 0) / (stations.length || 1);
  const avgGas = stations.reduce((acc, s) => acc + s.readings.gasConcentrationPpm, 0) / (stations.length || 1);
  const avgPressure = stations.reduce((acc, s) => acc + s.readings.barometricHpa, 0) / (stations.length || 1);
  const avgWind = stations.reduce((acc, s) => acc + s.readings.windSpeedKmh, 0) / (stations.length || 1);
  const avgStrain = stations.reduce((acc, s) => acc + s.readings.tectonicStrainMicro, 0) / (stations.length || 1);
  const avgTemp = stations.reduce((acc, s) => acc + s.readings.groundTempC, 0) / (stations.length || 1);

  if (!isElevatedSimulation) {
    return {
      disasterType: type,
      threatLevel: 'NORMAL',
      probabilityScore: 4.8,
      estimatedTimeToImpactMin: 999,
      epicenter: { lat: epic.lat, lng: epic.lng, name: epic.name },
      magnitudeOrSeverity: 'Background Baseline - Nominal Environmental Stability',
      radiusAlphaKm: 0,
      radiusBetaKm: 0,
      radiusGammaKm: 0,
      affectedPopulation: 0,
      confidenceInterval: '99.4% [Baseline Model]',
      xaiAttribution: [
        {
          feature: 'Seismic Strain Rate',
          impactPercent: 3.2,
          currentValue: `${avgStrain.toFixed(1)} μstrain`,
          baselineValue: '< 45 μstrain',
          direction: 'increase',
          description: 'Within standard subterranean elastic limits',
        },
        {
          feature: 'Atmospheric Stability',
          impactPercent: 2.1,
          currentValue: `${avgPressure.toFixed(0)} hPa`,
          baselineValue: '1013.2 hPa',
          direction: 'decrease',
          description: 'Standard barometric gradient',
        },
      ],
      summary: 'Sensors report standard ambient environmental conditions across all telemetry nodes.',
      recommendedAction: 'Maintain continuous automated sensor polling and standard readiness telemetry.',
      timestamp: Date.now(),
    };
  }

  // Active Disaster Simulation: Compute high-fidelity risk metrics
  let probability = 88 + Math.floor(Math.random() * 8); // 88% - 95%
  let estLeadTime = 11 + Math.floor(Math.random() * 4); // 11 - 14 minutes lead warning
  let threatLevel: ThreatLevel = 'CRITICAL';
  let xai: XaiFeatureImpact[] = [];
  let summary = '';
  let action = '';

  switch (type) {
    case 'earthquake':
      probability = 92;
      estLeadTime = 9; // 9 minutes P-wave / foreshock detection
      threatLevel = 'EXTREME';
      xai = [
        {
          feature: 'Tectonic Microstrain Anomaly (LSTM)',
          impactPercent: 44,
          currentValue: `${Math.max(avgStrain, 290).toFixed(0)} μstrain (+480%)`,
          baselineValue: '35 μstrain',
          direction: 'increase',
          description: 'Sudden fault dilatancy surge along segment sub-crustal lineation',
        },
        {
          feature: 'Foreshock P-Wave Frequency Shift',
          impactPercent: 28,
          currentValue: '4.8 Hz Low-Freq Resonant Tremor',
          baselineValue: '< 0.3 Hz',
          direction: 'increase',
          description: 'Continuous harmonic microseisms preceding major shear rupture',
        },
        {
          feature: 'Radon / Sub-surface Gas Outgassing',
          impactPercent: 18,
          currentValue: `${Math.max(avgGas, 82).toFixed(1)} ppm SO2/Rn`,
          baselineValue: '12 ppm',
          direction: 'increase',
          description: 'Micro-fracture gas discharge detected in deep borehole sensors',
        },
        {
          feature: 'Ground Velocity Acceleration',
          impactPercent: 10,
          currentValue: '0.42 g Peak Ground Accel',
          baselineValue: '< 0.02 g',
          direction: 'increase',
          description: 'High-frequency ground shear acceleration spiking at fault margin',
        },
      ];
      summary = `Ensemble Random Forest & LSTM models detect imminent Mw 7.4 megathrust seismic rupture at ${epic.name}. Immediate shockwave arrival expected in ${estLeadTime} minutes.`;
      action = 'Trigger Zone Alpha 5km immediate evacuation. Hold Zone Beta 10km traffic buffer for 12 minutes to prevent expressway bottleneck.';
      break;

    case 'wildfire':
      probability = 94;
      estLeadTime = 14;
      threatLevel = 'EXTREME';
      xai = [
        {
          feature: 'Thermal Anomaly & Canopy Temp',
          impactPercent: 42,
          currentValue: `${Math.max(avgTemp, 68).toFixed(1)} °C (+180%)`,
          baselineValue: '22 °C',
          direction: 'increase',
          description: 'Satellite infrared & ground thermal nodes detect rapid thermal ignition spread',
        },
        {
          feature: 'Wind Velocity & Flare Vector',
          impactPercent: 32,
          currentValue: `${Math.max(avgWind, 64).toFixed(0)} km/h Gusts (SSW)`,
          baselineValue: '14 km/h',
          direction: 'increase',
          description: 'High downslope wind funneling firefront toward high-density suburban perimeter',
        },
        {
          feature: 'Relative Humidity Deficit',
          impactPercent: 16,
          currentValue: '9.4% Extreme Dryness',
          baselineValue: '55%',
          direction: 'decrease',
          description: 'Severe fuel moisture depletion creating explosive ember spotting',
        },
        {
          feature: 'CO / Particulate PM2.5 Spike',
          impactPercent: 10,
          currentValue: '380 μg/m³ PM2.5',
          baselineValue: '18 μg/m³',
          direction: 'increase',
          description: 'Heavy pyrolysis smoke column lofting across evacuation corridors',
        },
      ];
      summary = `Pyrogenic AI models predict Cat-5 extreme firestorm with high-velocity spotting embers approaching residential perimeter within ${estLeadTime} minutes.`;
      action = 'Evacuate Zone Alpha immediately toward Coastal Highway. Direct Zone Beta to prepare shelter bags and keep local lanes clear.';
      break;

    case 'volcano':
      probability = 91;
      estLeadTime = 15;
      threatLevel = 'CRITICAL';
      xai = [
        {
          feature: 'Magma Chamber Harmonic Tremor',
          impactPercent: 40,
          currentValue: '0.38 g Continuous Long-Period',
          baselineValue: '< 0.01 g',
          direction: 'increase',
          description: 'Acoustic emissions indicate rapid magma ascent through central conduit',
        },
        {
          feature: 'Sulfur Dioxide (SO2) Degassing Rate',
          impactPercent: 30,
          currentValue: `${Math.max(avgGas, 140).toFixed(0)} ppm SO2 Flux`,
          baselineValue: '8 ppm',
          direction: 'increase',
          description: '18x baseline SO2 release rate confirming open magma column boiling',
        },
        {
          feature: 'Caldera GPS InSAR Ground Uplift',
          impactPercent: 20,
          currentValue: '+18.4 cm Tilt Inflation',
          baselineValue: '< 0.5 cm',
          direction: 'increase',
          description: 'Crustal surface swelling over 4km² dome summit',
        },
        {
          feature: 'Fumarole Thermal Gradient',
          impactPercent: 10,
          currentValue: '184 °C Superheated Steam',
          baselineValue: '48 °C',
          direction: 'increase',
          description: 'Hydrothermal flashing prior to explosive phreatomagmatic blast',
        },
      ];
      summary = `Volcanological neural network predicts imminent sub-Plinian explosive eruption and pyroclastic ash surge in ${estLeadTime} minutes.`;
      action = 'Issue mandatory Level 4 evacuation for Zone Alpha (5km blast radius). Stagger Zone Beta (10km ashfall zone) into secondary safe shelters.';
      break;

    case 'tsunami':
      probability = 96;
      estLeadTime = 12;
      threatLevel = 'EXTREME';
      xai = [
        {
          feature: 'DART Deep Ocean Pressure Sensor Anomaly',
          impactPercent: 46,
          currentValue: '+2.8 bar Hydrostatic Crest Spike',
          baselineValue: '0.0 bar deviation',
          direction: 'increase',
          description: 'Deep-ocean seabed pressure gauges registered ocean column displacement',
        },
        {
          feature: 'Subduction Rupture Length & Slip',
          impactPercent: 26,
          currentValue: '6.4m Seabed Vertical Thrust',
          baselineValue: '0.0m',
          direction: 'increase',
          description: 'Major offshore thrust slip triggering high-velocity ocean wave packet',
        },
        {
          feature: 'Coastal Tidal Recede Phenomenon',
          impactPercent: 18,
          currentValue: '-3.2m Rapid Shoreline Drawdown',
          baselineValue: '+0.1m',
          direction: 'decrease',
          description: 'Tidal gauge shows severe coastal water pullback preceding main crest arrival',
        },
        {
          feature: 'Wave Velocity & Bathymetry Propagation',
          impactPercent: 10,
          currentValue: '720 km/h Wave Speed in Deep Basin',
          baselineValue: '0 km/h',
          direction: 'increase',
          description: 'Shoaling model predicts 14m surge upon shallow coastal approach',
        },
      ];
      summary = `Oceanographic ML simulator confirms destructive 14-meter tsunami surge moving at high speed toward low-lying coastal districts. Impact in ${estLeadTime} minutes.`;
      action = 'Evacuate Zone Alpha coastal strip (5km) immediately to Elevated Highland Shelters. Zone Beta hold positions away from waterfront choke points.';
      break;

    case 'tornado':
      probability = 89;
      estLeadTime = 8;
      threatLevel = 'EXTREME';
      xai = [
        {
          feature: 'Doppler Velocity Azimuthal Shear',
          impactPercent: 48,
          currentValue: '78 m/s Gate-to-Gate Rotational Shear',
          baselineValue: '< 12 m/s',
          direction: 'increase',
          description: 'Intense cyclonic vortex signature detected descending below 500m AGL',
        },
        {
          feature: 'Barometric Drop Rate (dp/dt)',
          impactPercent: 28,
          currentValue: '-18.4 hPa/10min Rapid Plunge',
          baselineValue: '< 1 hPa/10min',
          direction: 'decrease',
          description: 'Violent central core pressure plunge detected by urban mesonet',
        },
        {
          feature: 'Tornadic Debris Signature (TDS)',
          impactPercent: 14,
          currentValue: 'Correlation Coeff 0.72 (Debris Ball)',
          baselineValue: '0.98',
          direction: 'decrease',
          description: 'Radar dual-polarization confirms aloft airborne debris lofting',
        },
        {
          feature: 'Convective Available Potential Energy (CAPE)',
          impactPercent: 10,
          currentValue: '3,850 J/kg Extreme Instability',
          baselineValue: '800 J/kg',
          direction: 'increase',
          description: 'Extreme atmospheric buoyancy sustaining tornadic supercell',
        },
      ];
      summary = `Mesoscale AI radar algorithm confirms destructive EF-4 tornado touchdown on direct course toward central municipal sector. Impact in ${estLeadTime} minutes.`;
      action = 'Mandatory immediate underground & reinforced structure shelter for Zone Alpha. Order Zone Beta to seek hardened indoor refuge immediately.';
      break;

    case 'cyclone':
      probability = 95;
      estLeadTime = 18;
      threatLevel = 'CRITICAL';
      xai = [
        {
          feature: 'Central Barometric Pressure Deficit',
          impactPercent: 45,
          currentValue: `${Math.min(avgPressure, 942).toFixed(0)} hPa Core Eye Pressure`,
          baselineValue: '1013 hPa',
          direction: 'decrease',
          description: 'Catastrophic central pressure eye formation indicating Category 4+ intensity',
        },
        {
          feature: 'Sustained Core Wind Velocity',
          impactPercent: 29,
          currentValue: `${Math.max(avgWind, 185).toFixed(0)} km/h Max Wind (230 km/h Gusts)`,
          baselineValue: '20 km/h',
          direction: 'increase',
          description: 'Violent eyewall winds causing severe structural and uprooting threat',
        },
        {
          feature: 'Precipitation Intensity & Cloud Banding',
          impactPercent: 16,
          currentValue: '85 mm/hr Extreme Torrential Deluge',
          baselineValue: '< 2 mm/hr',
          direction: 'increase',
          description: 'Severe convective cloud bands producing massive localized flash flood risk',
        },
        {
          feature: 'Coastal Inundation & Astronomical Surge',
          impactPercent: 10,
          currentValue: '+4.8m Peak Storm Surge',
          baselineValue: '0.0m',
          direction: 'increase',
          description: 'Combined storm surge and high tide flooding low-elevation transit arteries',
        },
      ];
      summary = `Meteorological super-ensemble projects Category 4 Severe Cyclonic Storm landfall with destructive eyewall winds in ${estLeadTime} minutes.`;
      action = 'Zone Alpha coastal residents evacuate via inland elevated corridors immediately. Zone Beta staged evacuation starts after Alpha clearance.';
      break;
  }

  return {
    disasterType: type,
    threatLevel,
    probabilityScore: probability,
    estimatedTimeToImpactMin: estLeadTime,
    epicenter: { lat: epic.lat, lng: epic.lng, name: epic.name },
    magnitudeOrSeverity: epic.severity,
    radiusAlphaKm: 5,
    radiusBetaKm: 10,
    radiusGammaKm: 18,
    affectedPopulation: epic.pop,
    confidenceInterval: '94.8% [XGBoost + LSTM Ensemble]',
    xaiAttribution: xai,
    summary,
    recommendedAction: action,
    timestamp: Date.now(),
  };
}

import { INITIAL_SENSOR_STATIONS } from './iotStream';
import { DEFAULT_SHELTERS } from './routingEngine';
import { ResponderUnit } from '../types';

export const INITIAL_STATIONS = INITIAL_SENSOR_STATIONS;
export const INITIAL_SHELTERS = DEFAULT_SHELTERS;

export const INITIAL_RESPONDERS: ResponderUnit[] = [
  {
    id: 'unit-med-1',
    callsign: 'MEDIC-ECHO-1',
    type: 'AMBULANCE',
    location: { lat: 37.7820, lng: -122.4120 },
    status: 'AVAILABLE' as any,
    assignedZone: 'ALPHA',
    etaMinutes: 3,
  },
  {
    id: 'unit-fire-2',
    callsign: 'RESCUE-TOWER-4',
    type: 'FIRE_RESCUE',
    location: { lat: 37.7680, lng: -122.4280 },
    status: 'AVAILABLE' as any,
    assignedZone: 'ALPHA',
    etaMinutes: 5,
  },
  {
    id: 'unit-police-3',
    callsign: 'PATROL-MARSHAL-7',
    type: 'POLICE_EVAC',
    location: { lat: 37.7900, lng: -122.4050 },
    status: 'AVAILABLE' as any,
    assignedZone: 'BETA',
    etaMinutes: 4,
  },
  {
    id: 'unit-air-4',
    callsign: 'EAGLE-DRONE-RECON',
    type: 'AIR_RECON',
    location: { lat: 37.8010, lng: -122.4300 },
    status: 'AVAILABLE' as any,
    assignedZone: 'ALPHA',
    etaMinutes: 2,
  },
];

export function calculateAiPrediction(
  type: DisasterType,
  isElevated = false
): PredictionResult {
  return predictDisasterRisk(type, INITIAL_STATIONS, isElevated);
}

