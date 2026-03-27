import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { SitePageShell } from "@/components/layout/site-page-shell"
import { siteConfig } from "@/lib/site-config"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const baseUrl = new URL(siteConfig.url)

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: `${siteConfig.name} · Kurzfristige Personalbereitstellung`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
    title: `${siteConfig.name} · Personal für Event, Promotion & Logistik`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.className} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <SiteHeader />
        <main className="min-h-[60vh]">
          <SitePageShell>{children}</SitePageShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
