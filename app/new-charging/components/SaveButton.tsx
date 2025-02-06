"use client";
import { Button } from "@mantine/core";

export default function SaveButton({ onClick, disabled, loading }: { onClick?: () => void, disabled: boolean, loading: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Button
        loading={loading}
        loaderProps={{ type: 'dots' }}
        disabled={disabled}
        style={{
          fontSize: '20px',
          border: `1px solid ${disabled ? '#888888' : '#fffb00'}`, // Change border color based on disabled state
          width: '300px',
          height: '60px',
          marginTop: '40px',
        }}
        color= {disabled ? 'red' : '#fffb00'}
        variant="light"
        onClick={onClick}
      >
        Save charging
      </Button>
    </div>
  );
}
