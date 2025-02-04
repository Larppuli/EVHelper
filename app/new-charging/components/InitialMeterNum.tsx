"use client";
import { NumberInput } from '@mantine/core';
import { IconChargingPileFilled } from '@tabler/icons-react';

// Define the props interface for the InitialMeterNum component
interface InitialMeterNumProps {
    onInitialMeterNumChange: (value: number) => void;
    initialMeterNum: number;
}

export default function InitialMeterNum({ onInitialMeterNumChange, initialMeterNum }: InitialMeterNumProps) {
    const icon = <IconChargingPileFilled size={20} />;

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '20px' }}>
            <NumberInput
                leftSection={icon}
                label="Meter number before charging"
                suffix="KWh"
                allowNegative={false}
                value={initialMeterNum}
                onChange={(value) => onInitialMeterNumChange(typeof value === 'number' ? value : 0)}
                decimalScale={2}
                styles={(theme) => ({
                    input: {
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        height: '50px',
                        fontSize: '18px',
                        backgroundColor: theme.colors.dark[6],
                        color: theme.colors.gray[0],
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