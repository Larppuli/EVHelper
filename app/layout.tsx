import '@mantine/core/styles.css';
import Navbar from '@/components/Navbar/Navbar';
import Header from '@/components/Navbar/Header';
import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ backgroundColor: 'black' }}>
        <MantineProvider>
          <Header/>
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}