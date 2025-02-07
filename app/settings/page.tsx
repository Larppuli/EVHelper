'use client';

import { useState, useEffect } from 'react';
import { Stack, LoadingOverlay } from '@mantine/core';
import FeeInput from './components/FeeInput';
import SaveSettingsButton from './components/SaveSettingsButton';

export default function Page() {
  const [transmissionFee, setTransmissionFee] = useState<number>(0);
  const [marginPrice, setMarginPrice] = useState<number>(0);
  const [savingLoading, setSavingLoading] = useState<boolean>(false);
  const [overlayActive, setOverlayActive] = useState<boolean>(true);
  const [settingsFound, setSettingsFound] = useState<boolean>(false);

  const handleTransmissionFeeChange = (value: number) => setTransmissionFee(value);
  const handleMarginPriceChange = (value: number) => setMarginPrice(value);

    useEffect(() => {
      async function fetchSettingsData() {
        try {
          const response = await fetch('/api/settings');
          const data = await response.json();
          setMarginPrice(data[0]?.marginPrice);
          setTransmissionFee(data[0]?.transmissionFee);
          setSettingsFound(!!data[0]?.marginPrice || !!data[0]?.transmissionFee);
        } catch (error) {
          console.error('Failed to fetch charging data:', error);
        } finally {
          setOverlayActive(false);
        }
      }
  
      fetchSettingsData();
    }, []);

  const handleSave = async () => {
    const settingsObject = {
        marginPrice: marginPrice,
        transmissionFee: transmissionFee
    };

    try {
      if(settingsFound) {
        console.log(transmissionFee, marginPrice)
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
        bg='#0e0e0e' 
        pt='7px'
        mx='10px'
      >
        <LoadingOverlay
          visible={overlayActive}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
          loaderProps={{ color: '#fffb00', type: 'bars' }}
        />
        <FeeInput onFeeInputChange={handleMarginPriceChange} feeInput={marginPrice} suffix=' snt/kWh' label='Margin price' decimal={3} step={0.001} />
        <FeeInput onFeeInputChange={handleTransmissionFeeChange} feeInput={transmissionFee} suffix=' snt/kWh' label='Transmission fee' decimal={5} step={0.00001} />
        <SaveSettingsButton disabled={!marginPrice || !transmissionFee} loading={savingLoading} onClick={() => { handleSave(); setSavingLoading(true); }}/>
      </Stack>
    </Stack>
  );
}