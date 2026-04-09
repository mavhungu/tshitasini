import React from 'react'
import Link from 'next/link'
import { Leaf, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { VaultSafeShieldMedicalCrossIcon } from '@/components/icons/VaultSafeLogo'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/refund-policy', label: 'Refund Policy' },
]

const categories = [
  { label: 'Surgical Gloves', href: '/products?category=Gloves' },
  { label: 'Face Masks', href: '/products?category=Masks' },
  { label: 'Surgical Gowns', href: '/products?category=Gowns' },
  { label: 'Eye Protection', href: '/products?category=Eye+Protection' },
  { label: 'Face Shields', href: '/products?category=Face+Shields' },
]

async function getCurrentYear() {
  return new Date().getUTCFullYear()
}

export default async function Footer() {
  return (
    <footer className="bg-card border-t border-border text-foreground">
      <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-foreground"
            >
              <VaultSafeShieldMedicalCrossIcon className="h-6 w-6 text-primary" />
              <div className="leading-tight">
                <p>VaultSafe</p>
                <p className="text-xs font-normal text-muted-foreground">
                  Solutions
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted South African supplier of certified PPE and medical
              safety products. Quality you can count on — every time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  190 Scheiding Street
                  <br />
                  Pretoria, Gauteng
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+27 78 667 1901</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@vaultsafe.co.za</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  Mon–Fri: 08:00–17:00
                  <br />
                  Sat: 08:00–13:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator uses border-border CSS variable automatically */}
        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {await getCurrentYear()} VaultSafe Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Secured by</span>
            <span className="text-xs font-semibold text-white bg-[#00C3F7] px-2 py-1 rounded">
              Paystack
            </span>
            {/* <span className="text-xs font-semibold text-white bg-[#635BFF] px-2 py-1 rounded">
              Stripe
            </span>
            <span className="text-xs font-semibold text-white bg-[#003087] px-2 py-1 rounded">
              PayPal
            </span> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
