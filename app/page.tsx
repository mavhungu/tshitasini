import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, Award, Truck, Users,
  Headphones, ShieldCheck, Hand, Wind,
  Shirt, Eye, Shield, Footprints,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard, ProductCardSkeleton } from '@/components/store/ProductCard'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import { prisma } from '@/lib/prisma/client'

export const metadata: Metadata = {
  title:
    'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
  description:
    'Tshitasini Enviro Solutions supplies certified PPE products including surgery gloves, masks, gowns, and more to healthcare facilities across South Africa.',
  openGraph: {
    title: 'Tshitasini Enviro Solutions — Quality PPE & Medical Supplies',
    description:
      'Certified PPE for healthcare facilities and businesses across South Africa.',
    images: [{ url: '/og-image.png' }],
  },
}

const features = [
  {
    icon: Award,
    title: 'Certified Products',
    description: 'All PPE meets SABS and international safety standards.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Reliable nationwide delivery to your facility.',
  },
  {
    icon: Users,
    title: 'Bulk Orders',
    description: 'Competitive pricing for wholesale and bulk orders.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Expert support for all your PPE enquiries.',
  },
]

const categories = [
  { name: 'Gloves', icon: Hand, href: '/products?category=Gloves' },
  { name: 'Masks', icon: Wind, href: '/products?category=Masks' },
  { name: 'Gowns', icon: Shirt, href: '/products?category=Gowns' },
  { name: 'Eye Protection', icon: Eye, href: '/products?category=Eye+Protection' },
  { name: 'Face Shields', icon: Shield, href: '/products?category=Face+Shields' },
  { name: 'Shoe Covers', icon: Footprints, href: '/products?category=Shoe+Covers' },
]

async function FeaturedProducts() {
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{ ...product, price: Number(product.price) }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────── */}
        {/* Intentionally keeps white text — green gradient is always dark enough */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-green-800 text-white">
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🇿🇦 Proudly South African PPE Supplier
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Quality PPE for <br />
                <span className="text-green-200">Safer Workplaces</span>
              </h1>
              <p className="text-lg text-green-100 mb-8 leading-relaxed max-w-lg">
                Tshitasini Enviro Solutions supplies certified personal protective
                equipment to healthcare facilities, clinics, and businesses
                across South Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-green-50 font-semibold"
                >
                  <Link href="/products">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/contact">Get a Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Strip ───────────────────── */}
        {/* bg-background → white in light, dark surface in dark */}
        <section className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="shrink-0 p-2 bg-primary/10 rounded-lg">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ─────────────────── */}
        {/* bg-muted → zinc-50 in light, dark muted surface in dark */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
                  Our Products
                </p>
                <h2 className="text-3xl font-bold text-foreground">
                  Featured Products
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <FeaturedProducts />
            </Suspense>

            <div className="mt-8 text-center sm:hidden">
              <Button asChild variant="outline">
                <Link href="/products">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Categories ───────────────────────── */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
                Browse by Category
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                What We Supply
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group text-center"
                >
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Snippet ────────────────────── */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
                Who We Are
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Committed to Safety &amp; Quality
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Tshitasini Enviro Solutions is a proudly South African PPE supplier
                dedicated to providing healthcare facilities, clinics, and businesses
                with the highest quality protective equipment. We ensure compliance
                with all relevant safety standards so you can focus on what matters most.
              </p>
              <div className="flex justify-center gap-10 mb-8">
                {[
                  { icon: ShieldCheck, label: 'SABS Compliant' },
                  { icon: Award, label: 'ISO Certified' },
                  { icon: Users, label: '500+ Clients' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────── */}
        {/* Intentionally keeps white text — primary green is always dark enough */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Bulk Orders for Your Facility?
            </h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto">
              We offer competitive bulk pricing for hospitals, clinics,
              pharmacies, and large organisations. Get in touch and we will
              tailor a quote for you.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-green-50 font-semibold"
            >
              <Link href="/contact">
                Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
