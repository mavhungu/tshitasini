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
      <section className="bg-hero text-white pt-28 pb-12">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            We would love to hear from you. Reach out for orders, quotes,
            or any general enquiries and we will respond within one business day.
          </p>
        </div>
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
