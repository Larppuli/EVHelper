"use client";
import { Button } from "@mantine/core";

export default function SaveButton({ onClick, disabled, loading }: { onClick?: () => void, disabled: boolean, loading: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', }}>
      <Button
        loading={loading}
        loaderProps={{ type: 'dots' }}
        disabled={disabled}
        style={{
          fontSize: '20px',
          border: `1px solid ${disabled ? '#363636' : '#fffb00'}`,
          width: '80%',
          height: '60px',
          marginTop: '10px',
          backgroundColor: disabled ? 'rgba(128, 128, 128, 0.1)' : undefined,
          color: disabled ? '#363636' : undefined,
        }}
        color= '#fffb00'
        variant="light"
        onClick={onClick}
      >
        Save charging
      </Button>
    </div>
  );
}
