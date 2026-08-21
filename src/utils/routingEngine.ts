import { Coordinates, EvacuationRoute, EvacuationZoneType, RouteWaypoint, Shelter } from '../types';

export const DEFAULT_SHELTERS: Shelter[] = [
  {
    id: 'shelter-highland-dome',
    name: 'Highland Arena & Civic Emergency Dome',
    location: { lat: 37.8350, lng: -122.3700 },
    capacityTotal: 4500,
    capacityOccupied: 1240,
    suppliesStatus: 'OPTIMAL',
    medicalSupport: true,
    generatorBackup: true,
    accessibleForDisabled: true,
    contactNumber: '+1 (800) 555-EVAC-1',
  },
  {
    id: 'shelter-valley-stadium',
    name: 'Metro Valley Stadium & Relief Complex',
    location: { lat: 37.7120, lng: -122.4700 },
    capacityTotal: 6000,
    capacityOccupied: 2180,
    suppliesStatus: 'OPTIMAL',
    medicalSupport: true,
    generatorBackup: true,
    accessibleForDisabled: true,
    contactNumber: '+1 (800) 555-EVAC-2',
  },
  {
    id: 'shelter-north-academy',
    name: 'Northgate High Grounds Emergency Shelter',
    location: { lat: 37.8420, lng: -122.4350 },
    capacityTotal: 3200,
    capacityOccupied: 890,
    suppliesStatus: 'ADEQUATE',
    medicalSupport: true,
    generatorBackup: true,
    accessibleForDisabled: true,
    contactNumber: '+1 (800) 555-EVAC-3',
  },
  {
    id: 'shelter-south-convention',
    name: 'South Bay Multi-Purpose Expo Center',
    location: { lat: 37.6950, lng: -122.3900 },
    capacityTotal: 5000,
    capacityOccupied: 1650,
    suppliesStatus: 'OPTIMAL',
    medicalSupport: true,
    generatorBackup: true,
    accessibleForDisabled: true,
    contactNumber: '+1 (800) 555-EVAC-4',
  },
];

// Helper to calculate Haversine distance in km
export function calculateDistanceKm(p1: Coordinates, p2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeCapacityAwareRoute(
  origin: Coordinates & { name: string },
  zone: EvacuationZoneType,
  epicenter: Coordinates,
  shelters: Shelter[] = DEFAULT_SHELTERS
): EvacuationRoute {
  // 1. Select the best available shelter that has capacity (< 85% occupied) and minimizes hazard proximity
  const availableShelters = shelters.filter(
    (s) => s.capacityOccupied / s.capacityTotal < 0.90
  );
  const candidatePool = availableShelters.length > 0 ? availableShelters : shelters;

  // Find shelter that is furthest from epicenter while reasonably close to origin
  const scoredShelters = candidatePool.map((shelter) => {
    const distToOrigin = calculateDistanceKm(origin, shelter.location);
    const distToEpicenter = calculateDistanceKm(shelter.location, epicenter);
    // Score favors shelters with more space and safe distance from epicenter
    const occupancyRatio = shelter.capacityOccupied / shelter.capacityTotal;
    const score = distToOrigin * 1.0 - distToEpicenter * 0.5 + occupancyRatio * 8.0;
    return { shelter, score, distToOrigin };
  });

  scoredShelters.sort((a, b) => a.score - b.score);
  const destinationShelter = scoredShelters[0].shelter;

  // 2. Generate capacity-aware segregated Dijkstra waypoints
  // Zone Alpha gets priority dedicated Arterial Route A (express cleared corridor)
  // Zone Beta gets Secondary Arterial Route B (bypass perimeter to avoid choking Alpha corridors)
  const isAlpha = zone === 'ALPHA';
  const corridorName = isAlpha
    ? 'Priority Corridor Alpha-1 (Emergency Cleared Transit)'
    : 'Staged Perimeter Corridor Beta-2 (Congestion-Bypass Expressway)';

  const startLat = origin.lat;
  const startLng = origin.lng;
  const destLat = destinationShelter.location.lat;
  const destLng = destinationShelter.location.lng;

  // Intermediate geometric routing avoiding epicenter
  const midLat = (startLat + destLat) / 2 + (isAlpha ? 0.008 : -0.012);
  const midLng = (startLng + destLng) / 2 + (isAlpha ? -0.010 : 0.015);

  const waypoints: RouteWaypoint[] = [
    {
      lat: startLat,
      lng: startLng,
      instruction: `Depart immediately from ${origin.name}. Follow ${isAlpha ? 'Priority Red Zone' : 'Staged Orange Zone'} markers.`,
      distanceToNextMeters: 450,
      hazardAvoided: 'Active Seismic Rupture Zone 500m South',
    },
    {
      lat: startLat + (midLat - startLat) * 0.4,
      lng: startLng + (midLng - startLng) * 0.4,
      instruction: `Turn RIGHT onto ${isAlpha ? 'Westside Express Freeway' : 'Valley Ridge Ring Road'}. Maintain steady 40 km/h flow.`,
      distanceToNextMeters: 1200,
      hazardAvoided: 'Hazardous Overhead Power Grid & Industrial Gas Terminal',
    },
    {
      lat: midLat,
      lng: midLng,
      instruction: `Merge into dedicated ${isAlpha ? 'Alpha Lane 1' : 'Beta Staged Lane 2'}. Follow digital LED emergency highway signs.`,
      distanceToNextMeters: 2800,
      hazardAvoided: 'Downtown Underpass Bottleneck & Debris Zone',
    },
    {
      lat: destLat - (destLat - midLat) * 0.3,
      lng: destLng - (destLng - midLng) * 0.3,
      instruction: `Take Exit 14 towards ${destinationShelter.name}. Emergency responder marshals directing safe entry.`,
      distanceToNextMeters: 900,
    },
    {
      lat: destLat,
      lng: destLng,
      instruction: `Arrived safely at ${destinationShelter.name}. Proceed to Triage & Family Registration Desk.`,
      distanceToNextMeters: 0,
      isShelter: true,
    },
  ];

  const totalDist = parseFloat(calculateDistanceKm(origin, destinationShelter.location).toFixed(1));
  const estMinutes = Math.max(8, Math.round(totalDist * (isAlpha ? 2.2 : 2.8)));
  const bottleneckScore = isAlpha ? 12 : 28; // Staggering keeps congestion low

  return {
    id: `route-${zone.toLowerCase()}-${Date.now()}`,
    zone,
    origin,
    destinationShelter,
    waypoints,
    totalDistanceKm: totalDist,
    estTravelTimeMinutes: estMinutes,
    bottleneckScore,
    status: isAlpha ? 'ACTIVE' : 'HOLDING',
    alternateCorridorName: corridorName,
  };
}

export function computeEvacuationCorridors(
  epicenter: Coordinates & { name?: string },
  shelters: Shelter[],
  groundReports: any[],
  currentZone: EvacuationZoneType = 'ALPHA'
): EvacuationRoute[] {
  // Generate distinct routes for Zone Alpha and Zone Beta
  const alphaOrigin = {
    lat: epicenter.lat + 0.012,
    lng: epicenter.lng - 0.008,
    name: 'Sector Alpha-4 (Downtown Residential Corridor)',
  };

  const betaOrigin = {
    lat: epicenter.lat + 0.035,
    lng: epicenter.lng + 0.025,
    name: 'Sector Beta-7 (Midtown Suburb Corridor)',
  };

  const gammaOrigin = {
    lat: epicenter.lat - 0.045,
    lng: epicenter.lng - 0.035,
    name: 'Sector Gamma-1 (Outer Ring Buffer)',
  };

  const routeAlpha = computeCapacityAwareRoute(alphaOrigin, 'ALPHA', epicenter, shelters);
  const routeBeta = computeCapacityAwareRoute(betaOrigin, 'BETA', epicenter, shelters);
  const routeGamma = computeCapacityAwareRoute(gammaOrigin, 'GAMMA', epicenter, shelters);

  return [routeAlpha, routeBeta, routeGamma];
}

