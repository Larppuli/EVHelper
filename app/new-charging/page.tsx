'use client';

import { useState } from 'react';
import { Paper } from '@mantine/core';
import InitialMeterNum from './components/InitialMeterNum';
import MeterNumAfter from './components/MeterNumAfter';
import StartingTime from './components/StartingTime';
import SaveButton from './components/SaveButton';
import ChargingTime from './components/ChargingTime';

export default function Page() {
  const [initialMeterNum, setInitialMeterNum] = useState<number>(0);
  const [meterNumAfter, setMeterNumAfter] = useState<number>(initialMeterNum);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  // Handle changes in the form inputs
  const handleInitialMeterNumChange = (value: number) => setInitialMeterNum(value);
  const handleMeterNumAfterChange = (value: number) => setMeterNumAfter(value);
  const handleStartTimeChange = (value: Date | null) => setStartTime(value);
  const handleChargingHourChange = (value: number) => setHours(value);
  const handleChargingMinuteChange = (value: number) => setMinutes(value);

  // Calculate the end time of the charge
  const calculateEndTime = (start: Date, hours: number, minutes: number): Date => {
    const endTime = new Date(start);
    endTime.setHours(start.getHours() + hours);
    endTime.setMinutes(start.getMinutes() + minutes);
    return endTime;
  };

  // Create an array of all the hours and dates when the charging happened
  const createChargingHoursArray = (start: Date, end: Date): Array<{ date: string, hour: number, minutes: number }> => {
    const chargingHours = [];
    let minutesLeft = hours * 60 + minutes;

    let currentHour = start.getHours();
    let currentDate = start.toISOString().split('T')[0];

    let minutesCharged = 60 - start.getMinutes();
    
    chargingHours.push({ date: currentDate, hour: currentHour, minutes: Math.min(minutesCharged, minutesLeft) });
    minutesLeft -= Math.min(minutesCharged, minutesLeft);

    while (minutesLeft > 0) {
      start.setHours(start.getHours() + 1);
      currentHour = start.getHours();
      currentDate = start.toISOString().split('T')[0];
      minutesCharged = Math.min(60, minutesLeft);
      chargingHours.push({ date: currentDate, hour: currentHour, minutes: minutesCharged });
      minutesLeft -= minutesCharged;
    }

    return chargingHours;
  };

  // Fetch the price for a specific date and hour
  const fetchPrice = async (date: string, hour: number): Promise<{ price: number }> => {
    const apiUrl = `/api/electricity-price?date=${date}&hour=${hour}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok for ${date} ${hour}`);
      }
      const { data } = await response.json();
      return { price: data.price };
    } catch (error) {
      return { price: 0 }; // Return a default value or handle the error as needed
    }
  };

  // Handle form submission
  const handleSave = async () => {
    if (!startTime) return;
  
    const priceOfHours = [];
    const totalElectricity = meterNumAfter - initialMeterNum;
    const electricityPerMinute = totalElectricity / (hours * 60 + minutes);
  
    const endTime = calculateEndTime(startTime, hours, minutes);
    const chargingHours = createChargingHoursArray(startTime, endTime);
  
    for (const { date, hour, minutes } of chargingHours) {
      const price = await fetchPrice(date, hour);
      priceOfHours.push({ 
        date, 
        hour, 
        priceOfHour: price, 
        electricity: electricityPerMinute * minutes, 
      });
    }
  
    const chargingObject = {
      meterNumAfter,
      startTime,
      endTime,
      chargingHours: priceOfHours,
      totalCost: priceOfHours.reduce((total, hour) => total + hour.priceOfHour.price * hour.electricity, 0),
    };
    
    try {
      const response = await fetch('/api/charging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chargingObject),
      });
  
      if (response.ok) {
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  

  return (
    <div
      style={{
        display: 'flex', 
        justifyContent: 'center',
        width: '100vw',
        height: '90vh',
        marginTop: '7vh',
      }}
    >
      <Paper style={{ width: '90vw', maxWidth: '400px', height: '78vh', marginTop: '2vh', backgroundColor: '#0e0e0e', paddingTop: '4vh', marginInline: '10px' }}>
        <InitialMeterNum onInitialMeterNumChange={handleInitialMeterNumChange} initialMeterNum={initialMeterNum} />
        <MeterNumAfter onMeterNumAfterChange={handleMeterNumAfterChange} meterNumAfter={meterNumAfter} />
        <StartingTime onStartTimeChange={handleStartTimeChange} startTime={startTime} />
        <ChargingTime onHourChange={handleChargingHourChange} onMinuteChange={handleChargingMinuteChange} hours={hours} minutes={minutes} />
        <SaveButton onClick={handleSave} />
      </Paper>
    </div>
  );
}