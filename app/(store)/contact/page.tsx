import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/store/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with VaultSafe Solutions for orders, bulk quotes, product enquiries, or general support.',
}

const contactDetails = [
  {
    icon: MapPin,
    label: 'Address',
    lines: ['190 Scheiding Street', 'Pretoria, Gauteng, 0002'],
  },
  {
    icon: Phone,
    label: 'Phone',
    lines: ['+27 78 667 1901'],
  },
  {
    icon: Mail,
    label: 'Email',
    lines: ['info@VaultSafe.co.za'],
  },
  {
    icon: Clock,
    label: 'Business Hours',
    lines: ['Mon–Fri: 08:00–17:00', 'Saturday: 08:00–13:00', 'Sunday: Closed'],
  },
]

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────
          bg-background  →  oklch(1 0 0)   in light  (pure white)
                         →  oklch(0 0 0)   in dark   (pure black)
          All glow / dot-grid colours reference --primary (hue 235, blue-teal),
          so they shift automatically with the theme. No dark: variants needed.
      ──────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 pb-20 bg-background">

        {/* Atmospheric glow — left
            Uses --primary via an inline CSS variable reference so it stays
            in sync with your oklch(0.72 0.14 235) primary in both modes.     */}
        <div
          className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2
                     h-[520px] w-[520px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, oklch(from var(--primary) l c h / 0.35) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Atmospheric glow — right */}
        <div
          className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2
                     h-[520px] w-[520px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, oklch(from var(--primary) l c h / 0.25) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Dot-grid texture — primary colour at low opacity */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(oklch(from var(--primary) l c h / 0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Hairline top accent — uses --border token */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, oklch(from var(--primary) l c h / 0.4), transparent)',
          }}
        />

        {/* ── Text content ── */}
        <div className="relative z-10 container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 text-center">

          {/* Pill badge — bg-accent / text-accent-foreground are already
              the correct tinted surface in both modes per your globals.css   */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5
                       border border-border bg-accent text-accent-foreground
                       backdrop-blur-sm"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
            <span className="text-xs font-medium tracking-widest uppercase select-none">
              Contact Us
            </span>
          </div>

          {/* Heading — text-foreground switches white ↔ dark automatically */}
          <h1
            className="mb-5 text-4xl font-bold tracking-tight leading-[1.1]
                       md:text-5xl lg:text-6xl text-foreground"
          >
            Get In Touch
          </h1>

          {/* Subtext — text-muted-foreground is already lower-contrast in both modes */}
          <p
            className="mx-auto max-w-lg text-base leading-relaxed
                       md:text-lg text-muted-foreground"
          >
            We would love to hear from you. Reach out for orders, quotes,
            or any general enquiries and we will respond within one business day.
          </p>

        </div>

        {/* Bottom fade — from-muted resolves to your --muted token:
            light → oklch(0.9434 …)   dark → oklch(0.2090 0 0)
            Matches the bg-muted section below perfectly in both modes.       */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16
                     bg-gradient-to-t from-muted to-transparent"
        />
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact info card */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-bold text-foreground">
                    Contact Information
                  </h2>
                  {contactDetails.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold text-muted-foreground
                                     uppercase tracking-wider mb-1"
                        >
                          {item.label}
                        </p>
                        {item.lines.map((line) => (
                          <p key={line} className="text-sm text-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Form card */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Fill in the form below and we will get back to you
                    within one business day.
                  </p>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
