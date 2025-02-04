"use client";
import { DateTimePicker } from '@mantine/dates';
import { IconClockHour3Filled } from '@tabler/icons-react';

type StartingTimeProps = {
    onStartTimeChange: (value: Date | null) => void;
    startTime: Date | null;
  
  };

export default function StartingTime( { onStartTimeChange, startTime }: StartingTimeProps) {
    const icon = <IconClockHour3Filled size={20} />;

    return (
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '23px' }}>
            <DateTimePicker
                leftSection={icon}
                valueFormat="DD MMM YYYY hh:mm"
                label="Starting time of charging"
                value={startTime}
                onChange={(value) => {if (value) onStartTimeChange(value)}}
                placeholder="Enter starting time"
                styles={(theme) => ({
                    input: {
                        textAlign: 'center',
                        height: '50px',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                    dropdown: {
                        backgroundColor: theme.colors.dark[6],
                        color: theme.colors.gray[0],
                    },
                })}
            />
        </div>
    );
}
