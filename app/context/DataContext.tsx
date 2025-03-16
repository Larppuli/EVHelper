'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  marginPrice: number;
  transmissionFee: number;
}

interface PriceOfHour {
  price: number;
}

interface ChargingHour {
  date: string;
  hour: number;
  priceOfHour: PriceOfHour;
  minutesLoaded: number;
  electricity: number;
}

interface ChargingDataItem {
  _id: string;
  initialMeterNum: number;
  meterNumAfter: number;
  startTime: string;
  endTime: string;
  chargingHours: ChargingHour[];
  totalCost: number;
  totalTime: number;
  marginCost: number;
  transmissionCost: number;
}

interface Data {
  settings: Settings;
  dataCharging: ChargingDataItem[];
  isLoading: boolean;
}

interface DataContextType {
  data: Data;
  addChargingData: (newData: ChargingDataItem) => void;
  updateSettings: (newSettings: Settings) => void;
  deleteAllChargingData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Data>({ settings: { marginPrice: 0, transmissionFee: 0 }, dataCharging: [], isLoading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseCharging, responseSettings] = await Promise.all([
          fetch('/api/charging'),
          fetch('/api/settings')
        ]);
        
        const dataCharging = await responseCharging.json();
        const dataSettings = await responseSettings.json();

        setData({
          settings: dataSettings[0],
          dataCharging: dataCharging,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addChargingData = (newData: ChargingDataItem) => {
    setData(prevData => ({
      ...prevData,
      dataCharging: [...prevData.dataCharging, newData]
    }));
  };

  const updateSettings = (newSettings: Settings) => {
    setData(prevData => ({
      ...prevData,
      settings: newSettings
    }));
  };

  const deleteAllChargingData = () => {
    setData(prevData => ({
      ...prevData,
      dataCharging: []
    }));
  };

  return (
    <DataContext.Provider value={{ data, addChargingData, updateSettings, deleteAllChargingData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};