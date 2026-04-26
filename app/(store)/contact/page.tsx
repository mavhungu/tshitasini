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
      {/* ── Hero ─────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#060c16] py-32 pb-20">

        {/* Atmospheric glow — left arc */}
        <div
          className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, #10b981 0%, #065f46 35%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Atmospheric glow — right arc */}
        <div
          className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(circle, #10b981 0%, #065f46 35%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Subtle dot-grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(16,185,129,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 text-center">

          {/* Pill badge — mirrors Framesports "Careers" badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium tracking-widest text-white/70 uppercase">
              Contact Us
            </span>
          </div>

          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
            Get In Touch
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            We would love to hear from you. Reach out for orders, quotes,
            or any general enquiries and we will respond within one business day.
          </p>

        </div>

        {/* Bottom fade into the muted section below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted to-transparent" />
      </section>

      {/* ── Main Content ─────────────────────── */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info + Map */}
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
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
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

              {/* Map placeholder */}
              {/* <Card className="overflow-hidden">
                <div className="bg-muted h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <MapPin className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Sandton, Johannesburg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gauteng, South Africa
                  </p>
                </div>
              </Card> */}
            </div>

            {/* Form */}
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
