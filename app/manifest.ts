import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EVHelper',
    short_name: 'EVHelper',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/new-charging',
    display: 'standalone',
    background_color: '#0e0e0e',
    theme_color: '#0e0e0e',
    orientation: "portrait-primary",
    icons: [
    ],
  }
}