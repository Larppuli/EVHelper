'use client';

import { useEffect, useState } from 'react';
import { LoadingOverlay, Stack, Table, Group, Button } from '@mantine/core';
import { IconCalendar, IconReceiptEuro, IconChargingPile, IconChargingPileFilled, IconDownload, IconTrash } from '@tabler/icons-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Page() {
  interface ChargingSession {
    startTime: string;
    endTime: string;
    totalCost: number;
    totalTime: number;
    meterNumAfter: number;
    initialMeterNum: number;
    chargingHours: Array<{ 
      date: string; 
      hour: number; 
      priceOfHour: { price: number }; 
      electricity: number; 
      minutesLoaded: number }>;
  }

  interface Settings {
    marginPrice: number;
    transmissionFee: number;
  }

  const [chargingData, setChargingData] = useState<ChargingSession[]>([]);
  const [settingsData, setSettingsData] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChargingData() {
      try {
        const chargingResponse = await fetch('/api/charging');
        const chargingData = await chargingResponse.json();

        const settingsResponse = await fetch('/api/settings');
        const settingsData = await settingsResponse.json();

        const sortedData = chargingData.sort((a: ChargingSession, b: ChargingSession) => {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          return dateB - dateA;
        });

        setChargingData(sortedData);
        setSettingsData(settingsData[0]);
      } catch (error) {
        return 0;
      } finally {
        setLoading(false);
      }
    }

    fetchChargingData();
  }, []);

  async function generateExcelFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // Column B
    worksheet.getColumn('B').width = 27; 
  
    Object.assign(worksheet.getCell('B7'), {
      value: 'Latausaika',
      font: { bold: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    });

    for (let i = 0; i < 24; i++) {
      Object.assign(worksheet.getCell(`B${i+8}`), {
        value: `${i}:00 - ${(i + 1) % 24}:00`,
        font: { bold: true },
        border: {
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      });
    }

    Object.assign(worksheet.getCell('B32'), {
      value: 'Yhteensä',
      font: { bold: true },
      border: {
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        top: { style: 'thin' },
        right: { style: 'thin' }
      }
    });

    const labels = [
      '',
      'Ladattu',
      '',
      'Aloitusaika',
      'Latausaika',
      'Loppuaika',
      'Minuuttia',
      'kWh/min',
      '',
      'Mittarilukema ennen latausta',
      'Mittarilukema latauksen jälkeen',
      '',
      '',
      'Sähkö yhteensä, kWh',
      'Siirtomaksu per kWh',
      'Siirtomaksu EUR',
      'Pörssisähkön marginaali',
      'Marginaali EUR',
      '',
      'Sähkö yhteensä, EUR',
      '',
      'Veloitetaan'
    ];
    
    labels.forEach((label, index) => {
      const cell = worksheet.getCell(`B${33 + index}`);
      
      Object.assign(cell, {
        value: label,
        border: (33 + index <= 42) ? { left: { style: 'thin' }, right: { style: 'thin' } } : {} 
        }
      );

      Object.assign(cell, {
        value: label,
        border: (33 + index <= 42) ? { left: { style: 'thin' }, right: { style: 'thin' } } : {} 
        }
      );
    });

    Object.assign(worksheet.getCell('B43'), {
      value: 'Yhteensä',
      border: {
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    });

    // Generate charging block for each charging session
    chargingData.slice().reverse().forEach((session, index) => {
      const dateColumnLetter = getExcelColumn(index * 3 + 4);
      const kWhColumnLetter = getExcelColumn(index * 3 + 3);
      const EURkWhColumnLetter = getExcelColumn(index * 3 + 4);
      const EURColumnLetter = getExcelColumn(index * 3 + 5);

      worksheet.getColumn(dateColumnLetter).width = 13; 

      // Set the date of the charging session and borders to the cells
      Object.assign(worksheet.getCell(`${dateColumnLetter}6`), {
        value: formatDate(session.startTime),
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        }
      });

      Object.assign(worksheet.getCell(`${EURColumnLetter}6`), {
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}6`), {
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' }
        }
      });

      Object.assign(worksheet.getCell(`${dateColumnLetter}6`), {
        value: formatDate(session.startTime),
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}7`), {
        value: 'kWh',
        font: { bold: true },
        alignment: { horizontal: 'center' }
      });

      Object.assign(worksheet.getCell(`${EURkWhColumnLetter}7`), {
        value: 'EUR/kWh',
        font: { bold: true },
        alignment: { horizontal: 'center' }
      });

      Object.assign(worksheet.getCell(`${EURColumnLetter}7`), {
        value: 'EUR',
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          right: { style: 'thin' }
        }
      });

      // Generation of hourly data
      session.chargingHours.forEach((hourOfCharging) => {
        Object.assign(worksheet.getCell(`${kWhColumnLetter}${hourOfCharging.hour + 8}`), {
          value: hourOfCharging.electricity,
          alignment: { horizontal: 'center' }
        });

        Object.assign(worksheet.getCell(`${EURkWhColumnLetter}${hourOfCharging.hour + 8}`), {
          value: hourOfCharging.priceOfHour.price / 100,
          alignment: { horizontal: 'center' }
        });

        Object.assign(worksheet.getCell(`${EURColumnLetter}${hourOfCharging.hour + 8}`), {
          value: hourOfCharging.electricity * hourOfCharging.priceOfHour.price / 100,
          alignment: { horizontal: 'center' }
        });

        Object.assign(worksheet.getCell(`${kWhColumnLetter}32`), {
          value: session.meterNumAfter - session.initialMeterNum,
          alignment: { horizontal: 'center' },
          font: { bold: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
          }
        });

        Object.assign(worksheet.getCell(`${EURkWhColumnLetter}32`), {
          value: (session.totalCost / (session.meterNumAfter - session.initialMeterNum)).toFixed(4),
          alignment: { horizontal: 'center' },
          font: { bold: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
          }
        });

        Object.assign(worksheet.getCell(`${EURColumnLetter}32`), {
          value: session.totalCost,
          alignment: { horizontal: 'center' },
          font: { bold: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin'}
          }
        });

        for (let i = 0; i < 24; i++) {
          worksheet.getCell(`${EURColumnLetter}${i+8}`).border = {
            right: { style: 'thin' },
          };
        }
      });

      // Generation of summary
      Object.assign(worksheet.getCell(`${kWhColumnLetter}33`), {
        border: {
          left: { style: 'thin'}
        }
      });
      
      Object.assign(worksheet.getCell(`${kWhColumnLetter}34`), {
        value: session.meterNumAfter - session.initialMeterNum,
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${EURkWhColumnLetter}34`), {
        value: 'kWh',
        alignment: { horizontal: 'left' },
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}35`), {
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}36`), {
        value: new Date(session.startTime).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}37`), {
        value: `${(session.totalTime / 60).toFixed(0)} h ${session.totalTime % 60} min`,
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}38`), {
        value: new Date(session.endTime).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}39`), {
        value: session.totalTime,
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}40`), {
        value: (session.meterNumAfter - session.initialMeterNum) / session.totalTime,
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}41`), {
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}42`), {
        value: session.initialMeterNum,
        alignment: { horizontal: 'right' },
        border: {
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${kWhColumnLetter}43`), {
        value: session.meterNumAfter - session.initialMeterNum,
        alignment: { horizontal: 'right' },
        border: {
          bottom: { style: 'thin' },
          left: { style: 'thin'}
        }
      });

      Object.assign(worksheet.getCell(`${EURkWhColumnLetter}43`), {
        border: {
          bottom: { style: 'thin' },
        }
      });

      Object.assign(worksheet.getCell(`${EURColumnLetter}43`), {
        border: {
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      });

      for (let i = 0; i < 10; i++) {
        worksheet.getCell(`${EURColumnLetter}${i+33}`).border = {
          right: { style: 'thin' },
        };
      }

      const electricityTotal = chargingData.reduce((total, session) => total + (session.meterNumAfter - session.initialMeterNum), 0)

      // Total electricity
      Object.assign(worksheet.getCell('C46'), {
        value: electricityTotal,
      });

      // Transmission cost per kWh
      Object.assign(worksheet.getCell('C47'), {
        value: settingsData ? settingsData.transmissionFee / 100 : 0,
      });

      // Transmission fee EUR
      Object.assign(worksheet.getCell('C48'), {
        value: settingsData ? settingsData.transmissionFee * electricityTotal / 100 : 0,
      });

      // Margin price per kWh
      Object.assign(worksheet.getCell('C49'), {
        value: settingsData ? settingsData.marginPrice / 100 : 0,
      });

      // Margin price EUR
      Object.assign(worksheet.getCell('C50'), {
        value: settingsData ? (settingsData.marginPrice * electricityTotal / 100).toFixed(5) : 0,
      });

      // Electricity price EUR
      Object.assign(worksheet.getCell('C52'), {
        value: chargingData.reduce((total, session) => total + session.totalCost, 0),
      });

      // Electricity price + margin price + transmission fee
      Object.assign(worksheet.getCell('C54'), {
        value: (chargingData.reduce((total, session) => total + session.totalCost, 0)) + (settingsData ? settingsData.marginPrice * electricityTotal / 100 : 0) + (settingsData ? settingsData.transmissionFee * electricityTotal / 100 : 0)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    saveAs(blob, 'test.xlsx');
  }

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  };

  function getExcelColumn(colIndex: number): string {
    let column = "";
    while (colIndex > 0) {
      let remainder = (colIndex - 1) % 26;
      column = String.fromCharCode(65 + remainder) + column;
      colIndex = Math.floor((colIndex - 1) / 26);
    }
    return column;
  }

  return (
    <Stack
      mt="9vh"
      w="90vw"
      maw={600}
      mx="auto"
      mah='78vh'
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2, color: 'rgba(14, 14, 14, 0.6)' }}
        loaderProps={{ color: '#fffb00', type: 'bars' }}
      />
      <Group justify="flex-end" gap="xs">
        <Button 
          rightSection={<IconTrash size={14}/>}
          w='120px'
          bg='#141414'
          p={8}
        >
          Delete all
        </Button>
        <Button 
          rightSection={<IconDownload size={14}/>}
          w='120px'
          bg='#141414'
          onClick={generateExcelFile}
        >
          Export
        </Button>
      </Group>
      <Table.ScrollContainer bg="#0e0e0e" minWidth={100} style={{ borderRadius: '4px' }}>
        <Table>
          <Table.Thead>
            <Table.Tr bd={0} bg="#2f2f2f">
              <Table.Td c="#fffb00" ta="center"><IconCalendar/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconChargingPile/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconChargingPileFilled/></Table.Td>
              <Table.Td c="#fffb00" ta="center"><IconReceiptEuro/></Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody >
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
