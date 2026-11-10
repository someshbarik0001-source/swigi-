/**
 * Device Location Configuration & Geolocation Service
 * Default Location: SRM University AP (Andhra Pradesh)
 *
 * Coordinates:
 * Latitude: 16.46352° N
 * Longitude: 80.50854° E
 * Postal Code: 522240
 */

export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface DeviceLocationInfo {
  name: string;
  shortName: string;
  campus: string;
  zone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  landmark: string;
  hostelDefault: string;
  coordinates: DeviceCoordinates;
  isDefaultSrmAp: boolean;
}

export const SRM_AP_COORDINATES: DeviceCoordinates = {
  latitude: 16.46352,
  longitude: 80.50854,
  accuracy: 5,
  altitude: 25.0,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
};

export const DEFAULT_SRM_AP_LOCATION: DeviceLocationInfo = {
  name: 'SRM University AP, Andhra Pradesh',
  shortName: 'SRM AP',
  campus: 'SRM University AP Campus',
  zone: 'Chinnakakani / Mangalagiri',
  address: 'Neerukonda, Mangalagiri Mandal, Amaravati, Andhra Pradesh 522240',
  city: 'Amaravati',
  state: 'Andhra Pradesh',
  postalCode: '522240',
  landmark: 'Near Central Food Court & Academic Tier-1',
  hostelDefault: 'Ganga Boys Hostel, Block 2, Room 412',
  coordinates: SRM_AP_COORDINATES,
  isDefaultSrmAp: true,
};

const STORAGE_KEY = 'swigi_device_location';

/**
 * Initializes and locks device location to SRM University AP by default.
 * Polyfills navigator.geolocation so any browser or component GPS request
 * resolves directly to SRM University AP.
 */
export function initDefaultDeviceLocation(): DeviceLocationInfo {
  if (typeof window === 'undefined') return DEFAULT_SRM_AP_LOCATION;

  // Persist default SRM AP location in localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SRM_AP_LOCATION));
  } catch (err) {
    // ignore storage quota issues
  }

  // Intercept / Polyfill HTML5 Geolocation API
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);

    // Overwrite getCurrentPosition to return SRM AP coordinates by default
    navigator.geolocation.getCurrentPosition = (
      successCallback: PositionCallback,
      errorCallback?: PositionErrorCallback | null,
      options?: PositionOptions
    ) => {
      // Create valid GeolocationPosition object centered at SRM University AP
      const srmPosition = {
        coords: {
          latitude: DEFAULT_SRM_AP_LOCATION.coordinates.latitude,
          longitude: DEFAULT_SRM_AP_LOCATION.coordinates.longitude,
          accuracy: DEFAULT_SRM_AP_LOCATION.coordinates.accuracy,
          altitude: DEFAULT_SRM_AP_LOCATION.coordinates.altitude ?? null,
          altitudeAccuracy: DEFAULT_SRM_AP_LOCATION.coordinates.altitudeAccuracy ?? null,
          heading: DEFAULT_SRM_AP_LOCATION.coordinates.heading ?? null,
          speed: DEFAULT_SRM_AP_LOCATION.coordinates.speed ?? null,
          toJSON: () => ({ ...DEFAULT_SRM_AP_LOCATION.coordinates }),
        },
        timestamp: Date.now(),
        toJSON: () => ({ timestamp: Date.now(), coords: DEFAULT_SRM_AP_LOCATION.coordinates }),
      } as unknown as GeolocationPosition;

      // Deliver SRM AP position synchronously or via short tick
      setTimeout(() => {
        try {
          successCallback(srmPosition);
        } catch (e) {
          if (errorCallback) {
            errorCallback({
              code: 1,
              message: 'Failed to deliver SRM AP position',
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
          }
        }
      }, 50);
    };

    // Overwrite watchPosition to continuously broadcast SRM AP position
    navigator.geolocation.watchPosition = (
      successCallback: PositionCallback,
      errorCallback?: PositionErrorCallback | null
    ) => {
      const srmPosition = {
        coords: {
          latitude: DEFAULT_SRM_AP_LOCATION.coordinates.latitude,
          longitude: DEFAULT_SRM_AP_LOCATION.coordinates.longitude,
          accuracy: DEFAULT_SRM_AP_LOCATION.coordinates.accuracy,
          altitude: DEFAULT_SRM_AP_LOCATION.coordinates.altitude ?? null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({ ...DEFAULT_SRM_AP_LOCATION.coordinates }),
        },
        timestamp: Date.now(),
        toJSON: () => ({ timestamp: Date.now(), coords: DEFAULT_SRM_AP_LOCATION.coordinates }),
      } as unknown as GeolocationPosition;

      const intervalId = window.setInterval(() => {
        successCallback(srmPosition);
      }, 5000);

      successCallback(srmPosition);
      return intervalId;
    };
  }

  return DEFAULT_SRM_AP_LOCATION;
}

/**
 * Returns current device location info (defaults to SRM AP).
 */
export function getDeviceLocation(): DeviceLocationInfo {
  if (typeof window === 'undefined') return DEFAULT_SRM_AP_LOCATION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.coordinates) return parsed;
    }
  } catch (e) {
    // Fall back to default
  }
  return DEFAULT_SRM_AP_LOCATION;
}

/**
 * Calculate distance from device location (SRM AP) in kilometers using Haversine formula.
 */
export function calculateDistanceToDeviceKm(lat: number, lng: number): number {
  const current = getDeviceLocation();
  const R = 6371; // Earth's radius in km
  const dLat = ((lat - current.coordinates.latitude) * Math.PI) / 180;
  const dLng = ((lng - current.coordinates.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((current.coordinates.latitude * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
