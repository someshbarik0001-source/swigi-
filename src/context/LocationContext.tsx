import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DeviceLocationInfo,
  DEFAULT_SRM_AP_LOCATION,
  getDeviceLocation,
  initDefaultDeviceLocation,
} from '../utils/deviceLocation';

interface LocationContextType {
  deviceLocation: DeviceLocationInfo;
  isSrmApDefault: boolean;
  refreshDeviceLocation: () => void;
  setCustomHostel: (hostelName: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocationInfo>(() => {
    return initDefaultDeviceLocation();
  });

  useEffect(() => {
    // Ensure default device location at SRM AP is primed at startup
    initDefaultDeviceLocation();
  }, []);

  const refreshDeviceLocation = () => {
    const loc = initDefaultDeviceLocation();
    setDeviceLocation(loc);
  };

  const setCustomHostel = (hostelName: string) => {
    const updated: DeviceLocationInfo = {
      ...deviceLocation,
      hostelDefault: hostelName,
    };
    try {
      localStorage.setItem('swigi_device_location', JSON.stringify(updated));
    } catch (e) {}
    setDeviceLocation(updated);
  };

  return (
    <LocationContext.Provider
      value={{
        deviceLocation,
        isSrmApDefault: deviceLocation.isDefaultSrmAp,
        refreshDeviceLocation,
        setCustomHostel,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

