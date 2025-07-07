import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArguSemX',
  description: 'Interactive visualization of argumentation framework semantics',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
