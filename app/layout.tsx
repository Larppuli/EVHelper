import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { Metadata, Viewport } from 'next';
import RootLayoutClient from './RootLayoutClient';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ backgroundColor: 'black' }}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}