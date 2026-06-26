import './globals.css'

export const metadata = {
  title: 'NewsRadar | Open Core',
  description: 'A powerful, local-first open-source intelligence aggregator.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
