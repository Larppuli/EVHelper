"use client";
import { DateTimePicker } from '@mantine/dates';
import { IconClockHour3Filled } from '@tabler/icons-react';
import { DateTime } from 'luxon';

type StartingTimeProps = {
    onStartTimeChange: (value: DateTime | null) => void;
    startTime: DateTime | null;
  
  };

export default function StartingTime( { onStartTimeChange, startTime }: StartingTimeProps) {
    const icon = <IconClockHour3Filled size={20} />;

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '23px' }}>
            <DateTimePicker
                leftSection={icon}
                valueFormat="DD MMM YYYY hh:mm"
                label="Starting time of charging"
                value={startTime ? startTime.toJSDate() : undefined}
                onChange={(value) => {if (value) {onStartTimeChange(DateTime.fromJSDate(value))}}}
                placeholder="Enter starting time"
                styles={(theme) => ({
                    input: {
                      backgroundColor: theme.colors.dark[7],
                      color: theme.colors.gray[0],
                      borderColor: theme.colors.dark[5],
                      height: '50px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
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
