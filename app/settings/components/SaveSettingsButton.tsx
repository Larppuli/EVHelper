"use client";
import { Button } from "@mantine/core";

export default function SaveSettingsButton({ onClick, disabled, loading }: { onClick?: () => void, disabled: boolean, loading: boolean }) {

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Button
        loading={loading}
        loaderProps={{ type: 'dots' }}
        disabled={disabled}
        w='300px'
        h='60px'
        mb='40px'
        mt='20px'
        style={{
          border: `1px solid ${disabled ? '#888888' : '#fffb00'}`, // Change border color based on disabled state
          fontSize: '20px',
        }}
        color= {disabled ? 'red' : '#fffb00'}
        variant="light"
        onClick={onClick}
      >
        Save settings
      </Button>
    </div>
  );
}
