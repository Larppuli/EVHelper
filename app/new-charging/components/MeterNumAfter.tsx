"use client";
import { NumberInput } from '@mantine/core';
import { IconChargingPileFilled } from '@tabler/icons-react';

// Define the props interface for the MeterNumAfter component
interface MeterNumAfterProps {
    onMeterNumAfterChange: (value: number) => void;
    meterNumAfter: number;
}

export default function MeterNumAfter( { onMeterNumAfterChange, meterNumAfter }: MeterNumAfterProps) {
    const icon = <IconChargingPileFilled size={20} />;

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '23px' }}>
            <NumberInput
                leftSection={icon}
                label="Meter number after charging"
                suffix="KWh"
                allowNegative={false}
                value={meterNumAfter}
                onChange={(value) => onMeterNumAfterChange(typeof value === 'number' ? value : 0)}
                decimalScale={2}
                styles={(theme) => ({
                    input: {
                        backgroundColor: theme.colors.dark[6],
                        color: theme.colors.gray[0],
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        height: '50px',
                        fontSize: '18px',
                        '&:focus': {
                            borderColor: theme.colors.blue[6],
                        },
                    },
                    label: {
                        color: theme.colors.gray[4],
                        fontWeight: 500,
                    },
                    wrapper: {
                        marginBottom: theme.spacing.md,
                    },
                    control: {
                        borderColor: theme.colors.dark[4],
                        '&:hover': {
                            backgroundColor: theme.colors.dark[5],
                        },
                    },
                })}
                step={0.01}
                min={0}
                placeholder="Enter meter reading"
            />
        </div>
    );
}
