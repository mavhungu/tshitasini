import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider'

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase is required for absolute OG image URLs
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  title: {
    template: '%s | Tshitasini Enviro Solutions',
    default:
      'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
  },
  description:
    'Tshitasini Enviro Solutions supplies certified PPE products including surgery gloves, masks, gowns, and more to healthcare facilities across South Africa.',
  keywords: [
    'PPE', 'surgical gloves', 'face masks', 'surgical gowns',
    'eye protection', 'medical supplies', 'South Africa',
    'healthcare', 'safety equipment', 'personal protective equipment',
  ],
  authors: [{ name: 'Tshitasini Enviro Solutions' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Tshitasini Enviro Solutions',
    title: 'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
    description:
      'Certified PPE for healthcare facilities and businesses across South Africa.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
    description:
      'Certified PPE for healthcare facilities and businesses across South Africa.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster position={"top-right"} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
