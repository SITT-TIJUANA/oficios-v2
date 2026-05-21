import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Sistema de Oficios | H. Ayuntamiento de Tijuana',
  description: 'Control y seguimiento de oficios municipales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
