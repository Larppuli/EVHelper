import '@mantine/core/styles.css';
import Navbar from '@/components/Navbar/Navbar';
import Header from '@/components/Header';
import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import { DataProvider } from './context/DataContext';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "EVHelper",
  description: "EVHelper helps the documentation of prices of charging electric vehicles.",
  generator: "Next.js",
  creator: "Lauri Talvitie",
  icons: {
    apple: [
      {
        url: "/apple-icon.png",
        sizes: '192x192',
        type: "image/png"
      }
    ]
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ backgroundColor: 'black' }}>
        <MantineProvider>
          <DataProvider>
            <Header />
            <Navbar />
            <main>
              {children}
            </main>
          </DataProvider>
        </MantineProvider>
      </body>
    </html>
  );
}