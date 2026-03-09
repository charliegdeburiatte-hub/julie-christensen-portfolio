import type { Metadata } from 'next'
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/layout/CookieBanner'
import '@/styles/globals.css'

// TODO: swap to The Seasons when self-hosted files are available in /public/fonts/
// Using Playfair Display as stand-in for The Seasons (both are elegant display serifs)
const seasons = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-seasons',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Julie Christensen — Freelance Video Editor',
    template: '%s — Julie Christensen | Freelance Video Editor',
  },
  description:
    'Freelance video editor based in Vestfold, Norway. Specialising in long-form content, podcasts, and YouTube — working with creators and brands internationally.',
  openGraph: {
    title: 'Julie Christensen — Freelance Video Editor',
    description:
      'Your story, told with care. Long-form content, podcasts, and YouTube editing for creators who know what they want to say.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julie Christensen — Freelance Video Editor',
    description:
      'Your story, told with care. Long-form content, podcasts, and YouTube editing.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${seasons.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to set theme before paint — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('julie-theme')||'light';document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
      </head>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <ThemeProvider>
          <CookieBanner />
          <Nav />
          <main>{children}</main>
          <Footer />
          {/* FUTURE: Analytics — placeholder, not activated */}
          {/* <Analytics /> */}
          {/* FUTURE: Norwegian i18n — next-i18next scaffolded, not activated */}
        </ThemeProvider>
      </body>
    </html>
  )
}
