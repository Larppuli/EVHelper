'use client';

import { useEffect, useState } from 'react';
import { LoadingOverlay, Stack, Table } from '@mantine/core';
import { IconCalendar, IconReceiptEuro, IconChargingPile, IconChargingPileFilled } from '@tabler/icons-react';

export default function Page() {
  interface ChargingSession {
    startTime: string;
    endTime: string;
    totalCost: number;
    totalTime: number;
    meterNumAfter: number;
    initialMeterNum: number;
  }

  const [chargingData, setChargingData] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChargingData() {
      try {
        const response = await fetch('/api/charging');
        const data = await response.json();

        const sortedData = data.sort((a: ChargingSession, b: ChargingSession) => {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          return dateB - dateA;
        });

        setChargingData(sortedData);
      } catch (error) {
        return 0;
      } finally {
        setLoading(false);
      }
    }

    fetchChargingData();
  }, []);

  return (
    <Stack
      mt="9vh"
      w="90vw"
      maw={600}
      mx="auto"
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
        loaderProps={{ color: '#fffb00', type: 'bars' }}
      />
      <Table.ScrollContainer mt={10} bg="#0e0e0e"  minWidth={100} style={{ borderRadius: '4px' }}>
        <Table>
          <Table.Thead>
            <Table.Tr bd={0} bg="#2f2f2f">
              <Table.Td c="#fffb00" ta="center"><IconCalendar/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconChargingPile/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconChargingPileFilled/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconReceiptEuro/></Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {chargingData.map((chargingSession, index) => (
              <Table.Tr style={{ borderBottom: '1px solid #2f2f2f' }} key={index}>
                <Table.Td c="white" ta="center">{new Date(chargingSession.startTime).toLocaleDateString('fi-FI')}</Table.Td>
                <Table.Td c="white" ta="center">{chargingSession.initialMeterNum.toFixed(2)}</Table.Td>
                <Table.Td c="white" ta="center">{chargingSession.meterNumAfter.toFixed(2)}</Table.Td>
                <Table.Td c="white" ta="center">{chargingSession.totalCost.toFixed(2)} €</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
