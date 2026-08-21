import { SensorStation, TelemetryPoint, DisasterType } from '../types';

export const INITIAL_SENSOR_STATIONS: SensorStation[] = [
  {
    id: 'sensor-fault-north',
    name: 'North Fault Observatory #101',
    location: { lat: 37.7950, lng: -122.4100 },
    elevationMeters: 140,
    status: 'ONLINE',
    lastPing: Date.now(),
    readings: {
      seismicAccelG: 0.012,
      richterEstimate: 1.4,
      barometricHpa: 1013.2,
      windSpeedKmh: 14.5,
      gasConcentrationPpm: 8.4,
      groundTempC: 18.2,
      rainfallMmH: 0.0,
      tectonicStrainMicro: 32.0,
    },
  },
  {
    id: 'sensor-urban-downtown',
    name: 'Metro Center Mesonet #204',
    location: { lat: 37.7749, lng: -122.4194 },
    elevationMeters: 42,
    status: 'ONLINE',
    lastPing: Date.now(),
    readings: {
      seismicAccelG: 0.015,
      richterEstimate: 1.6,
      barometricHpa: 1012.8,
      windSpeedKmh: 18.0,
      gasConcentrationPpm: 12.0,
      groundTempC: 21.0,
      rainfallMmH: 0.0,
      tectonicStrainMicro: 38.5,
    },
  },
  {
    id: 'sensor-coastal-buoy',
    name: 'Pacific Tidal & Infrasound Buoy #308',
    location: { lat: 37.8050, lng: -122.4650 },
    elevationMeters: 0,
    status: 'ONLINE',
    lastPing: Date.now(),
    readings: {
      seismicAccelG: 0.008,
      richterEstimate: 1.1,
      barometricHpa: 1014.1,
      windSpeedKmh: 24.2,
      gasConcentrationPpm: 4.1,
      groundTempC: 15.5,
      rainfallMmH: 0.2,
      tectonicStrainMicro: 24.0,
    },
  },
  {
    id: 'sensor-forest-east',
    name: 'East Ridge Canopy & Thermal Node #412',
    location: { lat: 37.7880, lng: -122.3850 },
    elevationMeters: 220,
    status: 'ONLINE',
    lastPing: Date.now(),
    readings: {
      seismicAccelG: 0.010,
      richterEstimate: 1.3,
      barometricHpa: 1011.5,
      windSpeedKmh: 21.0,
      gasConcentrationPpm: 9.8,
      groundTempC: 22.4,
      rainfallMmH: 0.0,
      tectonicStrainMicro: 30.2,
    },
  },
  {
    id: 'sensor-borehole-south',
    name: 'South Basin Crustal Borehole #505',
    location: { lat: 37.7320, lng: -122.4350 },
    elevationMeters: 85,
    status: 'ONLINE',
    lastPing: Date.now(),
    readings: {
      seismicAccelG: 0.014,
      richterEstimate: 1.5,
      barometricHpa: 1013.0,
      windSpeedKmh: 16.0,
      gasConcentrationPpm: 10.5,
      groundTempC: 19.8,
      rainfallMmH: 0.0,
      tectonicStrainMicro: 41.0,
    },
  },
];

export function generateNextSensorReadings(
  currentStations: SensorStation[],
  isDisasterActive: boolean,
  disasterType: DisasterType
): { updatedStations: SensorStation[]; telemetryPoint: TelemetryPoint } {
  const updatedStations = currentStations.map((station) => {
    let {
      seismicAccelG,
      richterEstimate,
      barometricHpa,
      windSpeedKmh,
      gasConcentrationPpm,
      groundTempC,
      rainfallMmH,
      tectonicStrainMicro,
    } = station.readings;

    if (!isDisasterActive) {
      // Normal minor natural jitter
      seismicAccelG = Math.max(0.005, 0.012 + (Math.random() - 0.5) * 0.006);
      richterEstimate = 1.2 + (Math.random() - 0.5) * 0.4;
      barometricHpa = 1013 + (Math.random() - 0.5) * 1.5;
      windSpeedKmh = Math.max(5, 16 + (Math.random() - 0.5) * 4);
      gasConcentrationPpm = Math.max(2, 9 + (Math.random() - 0.5) * 2);
      groundTempC = 19 + (Math.random() - 0.5) * 1.2;
      rainfallMmH = Math.max(0, (Math.random() - 0.8) * 2);
      tectonicStrainMicro = Math.max(15, 34 + (Math.random() - 0.5) * 5);

      return {
        ...station,
        status: 'ONLINE' as const,
        lastPing: Date.now(),
        readings: {
          seismicAccelG,
          richterEstimate,
          barometricHpa,
          windSpeedKmh,
          gasConcentrationPpm,
          groundTempC,
          rainfallMmH,
          tectonicStrainMicro,
        },
      };
    }

    // Disaster Anomaly Spikes depending on type
    switch (disasterType) {
      case 'earthquake':
        seismicAccelG = 0.38 + Math.random() * 0.15;
        richterEstimate = 7.2 + Math.random() * 0.3;
        tectonicStrainMicro = 320 + Math.random() * 60;
        gasConcentrationPpm = 65 + Math.random() * 25;
        break;
      case 'wildfire':
        groundTempC = 72 + Math.random() * 18;
        windSpeedKmh = 68 + Math.random() * 15;
        gasConcentrationPpm = 180 + Math.random() * 40;
        rainfallMmH = 0;
        break;
      case 'volcano':
        gasConcentrationPpm = 145 + Math.random() * 50;
        groundTempC = 88 + Math.random() * 30;
        seismicAccelG = 0.28 + Math.random() * 0.12;
        tectonicStrainMicro = 240 + Math.random() * 40;
        break;
      case 'tsunami':
        barometricHpa = 998 + (Math.random() - 0.5) * 6;
        seismicAccelG = 0.32 + Math.random() * 0.1;
        windSpeedKmh = 54 + Math.random() * 12;
        rainfallMmH = 14 + Math.random() * 6;
        break;
      case 'tornado':
        windSpeedKmh = 140 + Math.random() * 35;
        barometricHpa = 960 + Math.random() * 12;
        rainfallMmH = 45 + Math.random() * 20;
        break;
      case 'cyclone':
        windSpeedKmh = 165 + Math.random() * 30;
        barometricHpa = 945 + Math.random() * 10;
        rainfallMmH = 75 + Math.random() * 25;
        break;
    }

    return {
      ...station,
      status: 'CRITICAL' as const,
      lastPing: Date.now(),
      readings: {
        seismicAccelG,
        richterEstimate,
        barometricHpa,
        windSpeedKmh,
        gasConcentrationPpm,
        groundTempC,
        rainfallMmH,
        tectonicStrainMicro,
      },
    };
  });

  // Calculate composite telemetry point for rolling charts
  const avg = (fn: (s: SensorStation) => number) =>
    updatedStations.reduce((sum, s) => sum + fn(s), 0) / updatedStations.length;

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const telemetryPoint: TelemetryPoint = {
    time: timeStr,
    seismic: parseFloat(avg((s) => s.readings.seismicAccelG).toFixed(3)),
    pressure: parseFloat(avg((s) => s.readings.barometricHpa).toFixed(1)),
    gas: parseFloat(avg((s) => s.readings.gasConcentrationPpm).toFixed(1)),
    wind: parseFloat(avg((s) => s.readings.windSpeedKmh).toFixed(1)),
    temp: parseFloat(avg((s) => s.readings.groundTempC).toFixed(1)),
    strain: parseFloat(avg((s) => s.readings.tectonicStrainMicro).toFixed(1)),
  };

  return { updatedStations, telemetryPoint };
}

export function generateTelemetryReading(
  disasterType: DisasterType,
  isDisasterActive: boolean,
  timestamp = Date.now()
): TelemetryPoint {
  const d = new Date(timestamp);
  const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

  if (!isDisasterActive) {
    return {
      time: timeStr,
      seismic: +(0.012 + (Math.random() - 0.5) * 0.005).toFixed(3),
      pressure: +(1013.2 + (Math.random() - 0.5) * 1.5).toFixed(1),
      gas: +(8.4 + (Math.random() - 0.5) * 1.5).toFixed(1),
      wind: +(16.0 + (Math.random() - 0.5) * 3).toFixed(1),
      temp: +(19.8 + (Math.random() - 0.5) * 1.2).toFixed(1),
      strain: +(34.0 + (Math.random() - 0.5) * 4).toFixed(1),
    };
  }

  // Anomaly values
  switch (disasterType) {
    case 'earthquake':
      return {
        time: timeStr,
        seismic: +(0.42 + Math.random() * 0.15).toFixed(3),
        pressure: +(1011 + (Math.random() - 0.5) * 2).toFixed(1),
        gas: +(68 + Math.random() * 20).toFixed(1),
        wind: +(18 + Math.random() * 4).toFixed(1),
        temp: +(21 + Math.random() * 2).toFixed(1),
        strain: +(360 + Math.random() * 50).toFixed(1),
      };
    case 'wildfire':
      return {
        time: timeStr,
        seismic: +(0.015 + Math.random() * 0.005).toFixed(3),
        pressure: +(1009 + (Math.random() - 0.5) * 2).toFixed(1),
        gas: +(195 + Math.random() * 35).toFixed(1),
        wind: +(72 + Math.random() * 18).toFixed(1),
        temp: +(78 + Math.random() * 15).toFixed(1),
        strain: +(42 + Math.random() * 6).toFixed(1),
      };
    case 'volcano':
      return {
        time: timeStr,
        seismic: +(0.31 + Math.random() * 0.08).toFixed(3),
        pressure: +(1005 + (Math.random() - 0.5) * 3).toFixed(1),
        gas: +(160 + Math.random() * 45).toFixed(1),
        wind: +(28 + Math.random() * 6).toFixed(1),
        temp: +(92 + Math.random() * 25).toFixed(1),
        strain: +(280 + Math.random() * 40).toFixed(1),
      };
    case 'tsunami':
      return {
        time: timeStr,
        seismic: +(0.35 + Math.random() * 0.06).toFixed(3),
        pressure: +(998 + (Math.random() - 0.5) * 4).toFixed(1),
        gas: +(12 + Math.random() * 3).toFixed(1),
        wind: +(58 + Math.random() * 14).toFixed(1),
        temp: +(17 + Math.random() * 2).toFixed(1),
        strain: +(190 + Math.random() * 30).toFixed(1),
      };
    case 'tornado':
      return {
        time: timeStr,
        seismic: +(0.08 + Math.random() * 0.03).toFixed(3),
        pressure: +(958 + Math.random() * 10).toFixed(1),
        gas: +(15 + Math.random() * 4).toFixed(1),
        wind: +(148 + Math.random() * 32).toFixed(1),
        temp: +(16 + Math.random() * 2).toFixed(1),
        strain: +(55 + Math.random() * 10).toFixed(1),
      };
    case 'cyclone':
      return {
        time: timeStr,
        seismic: +(0.06 + Math.random() * 0.02).toFixed(3),
        pressure: +(942 + Math.random() * 8).toFixed(1),
        gas: +(14 + Math.random() * 3).toFixed(1),
        wind: +(172 + Math.random() * 28).toFixed(1),
        temp: +(24 + Math.random() * 2).toFixed(1),
        strain: +(60 + Math.random() * 12).toFixed(1),
      };
  }
}

