'use client';

import { useState, useEffect } from 'react';
import { Stack, Paper, LoadingOverlay, Notification, Transition } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import InitialMeterNum from './components/InitialMeterNum';
import MeterNumAfter from './components/MeterNumAfter';
import StartingTime from './components/StartingTime';
import SaveButton from './components/SaveButton';
import ChargingTime from './components/ChargingTime';
import { DateTime } from 'luxon';
import { useData } from '../context/DataContext';

export default function Page() {
  // State variables using context data for initialization
  const { data: { isLoading, settings, dataCharging: chargingData }, addChargingData } = useData() || { 
    data: { isLoading: true, settings: {}, dataCharging: [] }, 
    addChargingData: () => {}, 
  };
  const lastCharging = chargingData && chargingData.length > 0 ? chargingData[chargingData.length - 1] : null;

  const [initialMeterNum, setInitialMeterNum] = useState<number>(lastCharging?.meterNumAfter || 0);
  const [meterNumAfter, setMeterNumAfter] = useState<number>(lastCharging?.meterNumAfter || 0);
  const [startTime, setStartTime] = useState<DateTime | null>(
    DateTime.now().setZone('Europe/Helsinki')
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [enableAlert, setEnableAlert] = useState<boolean>(false);
  const [savingLoading, setSavingLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && lastCharging) {
      setInitialMeterNum(lastCharging.meterNumAfter || 0);
      // Update meterNumAfter if necessary
      setMeterNumAfter(lastCharging.meterNumAfter || 0);
    }
  }, [isLoading, lastCharging]);

  // Handle changes in the form inputs
  const handleInitialMeterNumChange = (value: number) => setInitialMeterNum(value);
  const handleMeterNumAfterChange = (value: number) => setMeterNumAfter(value);
  const handleStartTimeChange = (value: DateTime | null) => setStartTime(value);
  const handleChargingHourChange = (value: number) => {
    setHours(value);
    setMeterNumAfter(parseFloat((initialMeterNum + (minutes + 60 * value) * 0.1214).toFixed(2)));
  };
  const handleChargingMinuteChange = (value: number) => {
    setMinutes(value);
    setMeterNumAfter(parseFloat((initialMeterNum + (value + 60 * hours) * 0.1214).toFixed(2)));
  };

  const calculateEndTime = (start: DateTime, hours: number, minutes: number): DateTime => {
    return start.plus({ hours, minutes });
  };

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

  const handleSave = async () => {
    if (!startTime) return;

    const priceOfHours = [];
    const totalElectricity = meterNumAfter - initialMeterNum;
    const electricityPerMinute = totalElectricity / (hours * 60 + minutes);

    const endTime = calculateEndTime(startTime, hours, minutes);
    const chargingHours = createChargingHoursArray(startTime);

    for (const { date, hour, minutes } of chargingHours) {
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
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      chargingHours: priceOfHours,
      totalCost: priceOfHours.reduce((total, hour) => total + (hour.priceOfHour.price > 0 ? hour.priceOfHour.price : 0) * hour.electricity, 0) / 100,
      totalTime: hours * 60 + minutes,
      marginCost: settings.marginPrice * (meterNumAfter - initialMeterNum) * 0.01,
      transmissionCost: settings.transmissionFee * (meterNumAfter - initialMeterNum) * 0.01,
    };

    try {
      const response = await fetch('/api/charging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chargingObject),
      });

      if (response.ok) {
        const responseData = await response.json();
        addChargingData({ ...chargingObject, _id: responseData._id });
        setHours(0);
        setMinutes(0);
        setInitialMeterNum(meterNumAfter);
        setEnableAlert(true);

        setTimeout(() => {
          setEnableAlert(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setSavingLoading(false);
  };

  return (
    <Stack
      mt='7vh'
      h='90vh'
      w='100vw'
      align='center'
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
        loaderProps={{ color: '#fffb00', type: 'bars' }}
      />
      <Stack
        align='center'
        h='70vh'
        w='90vw'
        maw='400px'
        mt='2vh'
        bg='#141414'
        pt='4vh'
        mx='10px'
      >
        <Stack
          h='80%'
        >
          <InitialMeterNum onInitialMeterNumChange={handleInitialMeterNumChange} initialMeterNum={initialMeterNum} />
          <ChargingTime onHourChange={handleChargingHourChange} onMinuteChange={handleChargingMinuteChange} hours={hours} minutes={minutes} />
          <MeterNumAfter onMeterNumAfterChange={handleMeterNumAfterChange} meterNumAfter={meterNumAfter} minimum={initialMeterNum} />
          <StartingTime onStartTimeChange={handleStartTimeChange} startTime={startTime} />
          <SaveButton onClick={() => { handleSave(); setSavingLoading(true); }} disabled={hours === 0 && minutes === 0 || initialMeterNum-meterNumAfter>=0} loading={savingLoading} />
        </Stack>
          <Transition
            mounted={enableAlert}
            transition="pop"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Notification 
                bg='#252525' withCloseButton={false} 
                icon={<IconCheck />} 
                color="green" 
                title="All good!" mt="md"
                style={{
                  ...styles,
                  width: '90%',
                }}
                styles={{
                  title: { 
                    color: 'white',
                  },
                  description: {
                    color: 'white',
                  }
              }}>
                Charging saved successfully
              </Notification>
            )}
          </Transition>
      </Stack>
    </Stack>
  );
}