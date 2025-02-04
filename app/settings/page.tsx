import { Paper } from '@mantine/core';

export default function Page() {
  return (
    <div
      style={{
        display: 'flex', 
        justifyContent: 'center',
        width: '100vw',
        height: '90vh',
        marginTop: '7vh',
      }}
    >
      <Paper style={{ width: '90vw', maxWidth: '400px', height: '78vh', marginTop: '2vh', backgroundColor: '#0e0e0e', paddingTop: '4vh', marginInline: '10px' }}>
      </Paper>
    </div>
  );
}