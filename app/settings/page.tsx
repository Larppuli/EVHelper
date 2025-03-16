'use client';

import { useState } from 'react';
import { Stack } from '@mantine/core';
import FeeInput from './components/FeeInput';
import SaveSettingsButton from './components/SaveSettingsButton';
import { useData } from '../context/DataContext';

export default function Page() {
  const { data: { settings } } = useData() || { 
    data: { settings: {} }, 
    addChargingData: () => {}, 
    updateSettings: () => {} 
  };
  const [savingLoading, setSavingLoading] = useState<boolean>(false);
  const [settingsFound, setSettingsFound] = useState<boolean>(false);
  const [transmissionFee, setTransmissionFee] = useState<number>(settings.transmissionFee || 0);
  const [marginPrice, setMarginPrice] = useState<number>(settings.marginPrice || 0);

  const handleTransmissionFeeChange = (value: number) => setTransmissionFee(value);
  const handleMarginPriceChange = (value: number) => setMarginPrice(value);

  const handleSave = async () => {
    const settingsObject = {
        marginPrice: marginPrice,
        transmissionFee: transmissionFee
    };

    try {
      if(settingsFound) {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsObject),
        });
      } else {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsObject),
        });
        setSettingsFound(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setSavingLoading(false);
  };

  return (
    <Stack 
      align='center'
      h='90vh'
      mt='7vh'
      w='100vw'
    >
      <Stack 
        w='90vw' 
        maw='400px' 
        mt='2vh' 
        bg='#141414' 
        pt='7px'
        mx='10px'
      >
        <FeeInput onFeeInputChange={handleMarginPriceChange} feeInput={marginPrice} suffix=' snt/kWh' label='Margin price' decimal={3} step={0.001} />
        <FeeInput onFeeInputChange={handleTransmissionFeeChange} feeInput={transmissionFee} suffix=' snt/kWh' label='Transmission fee' decimal={5} step={0.00001} />
        <SaveSettingsButton disabled={!marginPrice || !transmissionFee} loading={savingLoading} onClick={() => { handleSave(); setSavingLoading(true); }}/>
      </Stack>
    </Stack>
  );
}