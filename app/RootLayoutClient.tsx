'use client';

import Navbar from '@/components/Navbar/Navbar';
import Header from '@/components/Header';
import DesktopNavigation from '@/components/DesktopNavigation';
import React, { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { DataProvider } from './context/DataContext';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MantineProvider>
      <DataProvider>
        {isDesktop ? (
          <DesktopNavigation />
        ) : (
          <>
            <Header />
            <Navbar />
          </>
        )}
        <main>
          {children}
        </main>
      </DataProvider>
    </MantineProvider>
  );
}
