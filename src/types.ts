export type DisasterType =
  | 'earthquake'
  | 'wildfire'
  | 'volcano'
  | 'tsunami'
  | 'tornado'
  | 'cyclone';

export type ThreatLevel = 'NORMAL' | 'ELEVATED' | 'CRITICAL' | 'EXTREME';

export type EvacuationZoneType = 'ALPHA' | 'BETA' | 'GAMMA';

export type AppViewMode = 'COMMAND_CENTER' | 'CITIZEN' | 'DUAL';

export type DemoStep =
  | 'STEP_1_NORMAL'
  | 'STEP_2_THREAT'
  | 'STEP_3_PREDICTION'
  | 'STEP_4_PANIC_PREVENTION';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SensorStation {
  id: string;
  name: string;
  location: Coordinates;
  elevationMeters: number;
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  lastPing: number;
  readings: {
    seismicAccelG: number;        // Seismic acceleration in g (normal < 0.05)
    richterEstimate: number;      // Equivalent Richter magnitude
    barometricHpa: number;        // Pressure (1013 normal, < 980 severe storm)
    windSpeedKmh: number;         // Wind speed (km/h)
    gasConcentrationPpm: number;  // Toxic/SO2/VOC gas ppm (< 15 normal)
    groundTempC: number;          // Ground surface temp (°C)
    rainfallMmH: number;          // Rain rate (mm/h)
    tectonicStrainMicro: number;  // Microstrain (normal < 50)
  };
}

export interface TelemetryPoint {
  time: string;
  seismic: number;
  pressure: number;
  gas: number;
  wind: number;
  temp: number;
  strain: number;
}

export interface XaiFeatureImpact {
  feature: string;
  impactPercent: number;
  currentValue: string;
  baselineValue: string;
  direction: 'increase' | 'decrease';
  description: string;
}

export interface PredictionResult {
  disasterType: DisasterType;
  threatLevel: ThreatLevel;
  probabilityScore: number;       // 0 to 100
  estimatedTimeToImpactMin: number;
  epicenter: {
    lat: number;
    lng: number;
    name: string;
  };
  magnitudeOrSeverity: string;
  radiusAlphaKm: number;
  radiusBetaKm: number;
  radiusGammaKm: number;
  affectedPopulation: number;
  confidenceInterval: string;
  xaiAttribution: XaiFeatureImpact[];
  summary: string;
  recommendedAction: string;
  timestamp: number;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  instruction: string;
  distanceToNextMeters: number;
  hazardAvoided?: string;
  isShelter?: boolean;
}

export interface EvacuationRoute {
  id: string;
  zone: EvacuationZoneType;
  origin: Coordinates & { name: string };
  destinationShelter: Shelter;
  waypoints: RouteWaypoint[];
  totalDistanceKm: number;
  estTravelTimeMinutes: number;
  bottleneckScore: number;       // 0 (completely clear) to 100 (heavily congested)
  status: 'ACTIVE' | 'HOLDING' | 'COMPLETED';
  alternateCorridorName: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: Coordinates;
  capacityTotal: number;
  capacityOccupied: number;
  suppliesStatus: 'OPTIMAL' | 'ADEQUATE' | 'LOW';
  medicalSupport: boolean;
  generatorBackup: boolean;
  accessibleForDisabled: boolean;
  contactNumber: string;
}

export interface ResponderUnit {
  id: string;
  callsign: string;
  type: 'AMBULANCE' | 'FIRE_RESCUE' | 'POLICE_EVAC' | 'AIR_RECON';
  location: Coordinates;
  status: 'IDLE' | 'DISPATCHED' | 'ON_SCENE' | 'RETURNING';
  assignedZone: EvacuationZoneType;
  etaMinutes: number;
}

export interface FamilyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  status: 'SAFE' | 'EVACUATING' | 'SHELTERED' | 'UNKNOWN' | 'NEEDS_HELP';
  lastSeenTime: string;
  locationName: string;
}

export interface GroundTruthReport {
  id: string;
  timestamp: number;
  citizenName: string;
  type: 'SMOKE_FIRE' | 'GROUND_TREMOR' | 'ROAD_BLOCK' | 'FLOOD_SURGE' | 'STRUCTURE_DAMAGE';
  location: Coordinates & { landmark: string };
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verified: boolean;
}

export interface PostEventTimelineEvent {
  timeOffsetMin: number;
  clockTime: string;
  title: string;
  description: string;
  category: 'PREDICTION' | 'ALERT' | 'STAGGER_DISPATCH' | 'SHELTER' | 'SAFETY';
}

export interface PostEventReport {
  simulationId: string;
  disasterType: DisasterType;
  leadTimeMinutes: number;
  evacuatedAlphaPercent: number;
  staggeredBetaSuccessPercent: number;
  trafficBottleneckReductionPercent: number;
  totalLivesProtected: number;
  timeline: PostEventTimelineEvent[];
}

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'es';
