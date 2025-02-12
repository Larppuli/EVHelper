'use client';

import { useState, useEffect } from 'react';
import { Paper, LoadingOverlay, Notification, Transition } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import InitialMeterNum from './components/InitialMeterNum';
import MeterNumAfter from './components/MeterNumAfter';
import StartingTime from './components/StartingTime';
import SaveButton from './components/SaveButton';
import ChargingTime from './components/ChargingTime';
import { DateTime } from 'luxon';

export default function Page() {
  // Define state variables
  const [initialMeterNum, setInitialMeterNum] = useState<number>(0);
  const [meterNumAfter, setMeterNumAfter] = useState<number>(0);
  const [startTime, setStartTime] = useState<DateTime | null>(
    DateTime.now().setZone('Europe/Helsinki')
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [enableAlert, setEnableAlert] = useState<boolean>(false);
  const [savingLoading, setSavingLoading] = useState<boolean>(false);
  const [settings, setSettings] = useState<any>();

  // Handle changes in the form inputs
  const handleInitialMeterNumChange = (value: number) => setInitialMeterNum(value);
  const handleMeterNumAfterChange = (value: number) => setMeterNumAfter(value);
  const handleStartTimeChange = (value: DateTime | null) => setStartTime(value);
  // Fill meterNumAfter automatically with approximation
  const handleChargingHourChange = (value: number) => {
    setHours(value);
    setMeterNumAfter(parseFloat((initialMeterNum + (minutes + 60 * value) * 0.1214).toFixed(2)));
  };
  const handleChargingMinuteChange = (value: number) => {
    setMinutes(value);
    setMeterNumAfter(parseFloat((initialMeterNum + (value + 60 * hours) * 0.1214).toFixed(2)));
  };

  useEffect(() => {
    async function fetchChargingData() {
      try {
        const responseCharging = await fetch('/api/charging');
        const responseSettings = await fetch('/api/settings');
        const dataCharging = await responseCharging.json();
        const dataSettings = await responseSettings.json();
        setSettings(dataSettings[0]);
        setInitialMeterNum(dataCharging[dataCharging.length - 1]?.meterNumAfter || 0);
        setMeterNumAfter(dataCharging[dataCharging.length - 1]?.meterNumAfter || 0);
      } catch (error) {
        console.error('Failed to fetch charging data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChargingData();
  }, []);

  // Calculate the end time of the charge
  const calculateEndTime = (start: DateTime, hours: number, minutes: number): DateTime => {
    return start.plus({ hours, minutes });
  };

  // Create an array of all the hours and dates when the charging happened
  const createChargingHoursArray = (start: DateTime) => {
    const chargingHours = [];
    let minutesLeft = hours * 60 + minutes;

    const firstMinutes = 60 - start.minute;
    let currentStart = start;

    if (firstMinutes < minutesLeft) {
      chargingHours.push({ date: currentStart.toISODate()!, hour: currentStart.hour, minutes: firstMinutes });
      minutesLeft -= firstMinutes;
      currentStart = currentStart.plus({ minutes: firstMinutes });
    }

    while (minutesLeft > 0) {
      const currentHour = currentStart.hour;
      const currentDate = currentStart.toISODate()!;

      const minutesCharged = Math.min(60, minutesLeft);
      chargingHours.push({ date: currentDate, hour: currentHour, minutes: minutesCharged });

      minutesLeft -= minutesCharged;
      currentStart = currentStart.plus({ hours: 1 });
    }

    return chargingHours;
  };

  // Fetch the price for a specific date and hour with retry logic
  const fetchPrice = async (date: string, hour: number): Promise<{ price: number }> => {
    const apiUrl = `/api/electricity-price?date=${date}&hour=${hour}`;
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${date} ${hour}`);
        }
        const { data } = await response.json();
        return { price: data.price };
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          return { price: 0 };
        }
      }
    }
    return { price: 0 };
  };

  // Handle form submission
  const handleSave = async () => {
    if (!startTime) {return;}

    const priceOfHours = [];
    const totalElectricity = meterNumAfter - initialMeterNum;
    const electricityPerMinute = totalElectricity / (hours * 60 + minutes);

    const endTime = calculateEndTime(startTime, hours, minutes);
    const chargingHours = createChargingHoursArray(startTime);

    for (const { date, hour, minutes } of chargingHours) {
      console.log(date, hour, minutes);
      const price = await fetchPrice(date, hour);
      priceOfHours.push({
        date,
        hour,
        priceOfHour: price,
        electricity: electricityPerMinute * minutes,
        minutesLoaded: minutes,
      });
    }

    const chargingObject = {
      initialMeterNum,
      meterNumAfter,
      startTime,
      endTime,
      chargingHours: priceOfHours,
      totalCost: priceOfHours.reduce((total, hour) => total + hour.priceOfHour.price * hour.electricity, 0) / 100,
      totalTime: hours * 60 + minutes,
      marginCost: settings.marginPrice * (meterNumAfter - initialMeterNum)  * 0.01,
      transmissionCost: settings.transmissionFee * (meterNumAfter - initialMeterNum) * 0.01,
    };

    try {
      const response = await fetch('/api/charging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chargingObject),
      });

      if (response.ok) {
        setHours(0);
        setMinutes(0);
        setInitialMeterNum(meterNumAfter);
        setEnableAlert(true);

        setTimeout(() => {
          setEnableAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setSavingLoading(false);
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
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
        loaderProps={{ color: '#fffb00', type: 'bars' }}
      />
      <Paper
        style={{
          width: '90vw',
          maxWidth: '400px',
          height: '78vh',
          marginTop: '2vh',
          backgroundColor: '#0e0e0e',
          paddingTop: '4vh',
          marginInline: '10px',
        }}
      >
        <InitialMeterNum onInitialMeterNumChange={handleInitialMeterNumChange} initialMeterNum={initialMeterNum} />
        <ChargingTime onHourChange={handleChargingHourChange} onMinuteChange={handleChargingMinuteChange} hours={hours} minutes={minutes} />
        <MeterNumAfter onMeterNumAfterChange={handleMeterNumAfterChange} meterNumAfter={meterNumAfter} minimum={initialMeterNum} />
        <StartingTime onStartTimeChange={handleStartTimeChange} startTime={startTime} />
        <SaveButton onClick={() => { handleSave(); setSavingLoading(true); }} disabled={hours === 0 && minutes === 0 || initialMeterNum-meterNumAfter>=0} loading={savingLoading} />
        {enableAlert && (
          <Transition
            mounted={enableAlert}
            duration={1100}
            timingFunction="ease"
            transition="fade"
          >
            {(styles) => (
              <Notification withCloseButton={false} icon={<IconCheck />} color="teal" title="All good!" mt="md" style={styles}>
                Charging saved successfully
              </Notification>
            )}
          </Transition>
        )}
      </Paper>
    </div>
  );
}