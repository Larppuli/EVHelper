"use client";
import { Button } from "@mantine/core";

export default function SaveButton({ onClick }: { onClick?: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Button
        style={{
          fontSize: '20px',
          border: '1px solid #fffb00',
          width: '300px',
          height: '60px',
          marginTop: '40px',
        }}
        color="#fffb00"
        variant="light"
        onClick={onClick}
      >
        Save charging
      </Button>
    </div>
  );
}
