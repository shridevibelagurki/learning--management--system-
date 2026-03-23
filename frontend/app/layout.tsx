import AIChatbot from './components/AIChatbot';

export const metadata = {
  title: 'CourseLit — AI Learning Platform',
  description: 'Learn anything with your personal AI tutor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif', margin: 0 }}>
        {children}
        <AIChatbot />
      </body>
    </html>
  )
}
