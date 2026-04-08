import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award, ShieldCheck, Truck, Users,
  Headphones, PackageCheck, ArrowRight, Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about VaultSafe Solutions — a proudly South African PPE supplier committed to quality, compliance, and protecting lives.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Certified & Compliant',
    description:
      'All products meet SABS, ISO, and WHO standards for healthcare and industrial safety.',
  },
  {
    icon: Award,
    title: 'Competitive Pricing',
    description:
      "Bulk discounts and wholesale pricing tailored to your organisation's needs.",
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description:
      'Nationwide delivery with a focus on on-time fulfilment for critical supplies.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description:
      'Our team assists with product selection, quotes, and order tracking.',
  },
  {
    icon: PackageCheck,
    title: 'Wide Product Range',
    description:
      'From surgical gloves to full PPE kits — everything under one roof.',
  },
  {
    icon: Users,
    title: 'Trusted by Healthcare Facilities',
    description:
      'Serving hospitals, clinics, pharmacies, and businesses across South Africa.',
  },
]

const productCategories = [
  { name: 'Surgical Gloves', href: '/products?category=Gloves' },
  { name: 'Examination Gloves', href: '/products?category=Gloves' },
  { name: 'Face Masks', href: '/products?category=Masks' },
  { name: 'Surgical Gowns', href: '/products?category=Gowns' },
  { name: 'Eye Protection', href: '/products?category=Eye+Protection' },
  { name: 'Shoe Covers', href: '/products?category=Shoe+Covers' },
  { name: 'Face Shields', href: '/products?category=Face+Shields' },
  { name: 'Hand Sanitisers', href: '/products?category=Sanitisers' },
]

const stats = [
  { value: '500+', label: 'Clients Served' },
  { value: '50+', label: 'Product Lines' },
  { value: '9', label: 'Provinces Covered' },
  { value: '100%', label: 'Certified Products' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="bg-[image:var(--color-hero)] py-28 pb-12">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 text-center">
          <h1 className="text-4xl text-white md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Protecting lives through quality PPE — that is the mission driving
            everything we do at VaultSafe Solutions.
          </p>
        </div>
      </section>

      {/* ── Our Story ────────────────────────── */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                Our Story
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Built on a Foundation of Safety
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  VaultSafe Solutions was founded with a clear purpose:
                  to make high-quality personal protective equipment accessible
                  to every healthcare facility, clinic, and business across South
                  Africa. We recognised the critical gap in the market for a
                  reliable, local PPE supplier.
                </p>
                <p>
                  Based in Pretoria, Gauteng, we serve clients nationwide —
                  from large hospitals and government facilities to small private
                  practices and industrial workplaces. Our commitment to quality
                  means we source only from certified manufacturers who meet
                  international safety standards.
                </p>
                <p>
                  Today, VaultSafe Solutions is a trusted name in the
                  PPE industry, known for consistent quality, competitive pricing,
                  and the kind of service that builds long-term relationships with
                  our clients.
                </p>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center"
                >
                  <p className="text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────── */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
              Why VaultSafe
            </p>
            <h2 className="text-3xl font-bold text-foreground">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-2 rounded-lg shrink-0">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Categories ───────────────── */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
              What We Offer
            </p>
            <h2 className="text-3xl font-bold text-foreground">
              Our Product Categories
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {productCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Leaf className="h-3.5 w-3.5" />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Place an Order?</h2>
          <p className="text-green-100 mb-8 max-w-xl mx-auto">
            Browse our full product catalogue or reach out for a custom quote tailored to your facility's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-green-50 font-semibold"
            >
              <Link href="/products">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
