"use client";
import { NumberInput } from "@mantine/core";

// Define the props interface for the ChargingTime component
interface ChargingTimeProps {
  onHourChange: (value: number) => void;
  onMinuteChange: (value: number) => void;
  hours: number;
  minutes: number;
}

// ChargingTime component definition
export default function ChargingTime({ onHourChange, onMinuteChange, hours, minutes }: ChargingTimeProps) {
  return (
    <div 
      style={{ 
        width: '80%',
        margin: 'auto', 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        marginTop: "10px",
       }}
    >
      <NumberInput
        label="Hours"
        placeholder="Enter hours"
        value={hours}
        onChange={(value) => onHourChange(typeof value === 'number' ? value : 0)}
        min={0}
        step={1}
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
          },
          label: {
            color: theme.colors.gray[4],
            fontWeight: 500,
          },
          control: {
            borderColor: theme.colors.dark[6],
          },
        })}
      />
      <NumberInput
        label="Minutes"
        placeholder="Enter minutes"
        value={minutes}
        onChange={(value) => onMinuteChange(typeof value === 'number' ? value : 0)}
        min={0}
        max={59}
        step={1}
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
          },
          label: {
            color: theme.colors.gray[4],
            fontWeight: 500,
          },
          control: {
            borderColor: theme.colors.dark[6],
          },
        })}
      />
    </div>
  );
}