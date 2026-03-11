import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hogis Occasio — Smart Holiday Notifications',
  description: 'Automate heartfelt holiday greetings to all your guests via Email & SMS. Powered by Hogis.',
  keywords: ['holiday notifications', 'email automation', 'SMS greetings', 'Hogis', 'Nigeria holidays'],
  authors: [{ name: 'Hogis Group' }],
  openGraph: {
    title: 'Hogis Occasio',
    description: 'Smart Holiday Notification System',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#e6edf3',
              border: '1px solid rgba(0,245,255,0.2)',
              borderRadius: '12px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00ffc8', secondary: '#010409' },
            },
            error: {
              iconTheme: { primary: '#ff4444', secondary: '#010409' },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
