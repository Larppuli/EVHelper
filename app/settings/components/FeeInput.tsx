"use client";

import { NumberInput } from '@mantine/core';
import { IconCoinEuro } from '@tabler/icons-react';

// Define the props interface for the InitialMeterNum component
interface InitialMeterNumProps {
  onFeeInputChange: (value: number) => void;
  feeInput: number;
  label: string;
  suffix: string;
  decimal: number;
  step: number;
}

export default function FeeInput({ onFeeInputChange, feeInput, label, suffix, decimal, step }: InitialMeterNumProps) {
    const icon = <IconCoinEuro size={20} />;

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '20px' }}>
            <NumberInput
                leftSection={icon}
                label={label}
                suffix={suffix}
                allowNegative={false}
                value={feeInput}
                onChange={(value) => onFeeInputChange(typeof value === 'number' ? value : 0)}
                decimalScale={decimal}
                styles={(theme) => ({
                    input: {
                      backgroundColor: theme.colors.dark[7],
                      color: theme.colors.gray[0],
                      borderColor: theme.colors.dark[5],
                      height: '50px',
                      fontSize: '18px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      width: '300px',
                    },
                    label: {
                      color: theme.colors.gray[4],
                      fontWeight: 500,
                    },
                    control: {
                      borderColor: theme.colors.dark[6],
                    },
                  })}
                step={step}
                min={0}
                placeholder="Enter margin price"
            />
        </div>
    );
}