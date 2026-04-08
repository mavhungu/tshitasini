'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cartStore'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.totalItems)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Main Nav ──────────────────────────────── */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b border-border/40 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-lg shadow-sm'
            : 'bg-background/75 backdrop-blur-md'
        )}
      >
        <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
            aria-label="Tshitasini Enviro Solutions home"
          >
            <Leaf className="h-6 w-6 text-primary" />
            <div className="leading-tight">
              <span>VaultSafe</span>
              <span className="hidden sm:inline text-foreground font-normal text-sm ml-1">
                Solutions
              </span>
            </div>
          </Link>

          {/* Right side — Desktop Nav + Theme Toggle + Cart + Hamburger */}
          <div className="flex items-center gap-1">

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1 mr-2 list-none">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                      pathname === href
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="cart"
                size="icon"
                className="relative hover:cursor-pointer"
                aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground rounded-full">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Animated hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-2 cursor-pointer"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span
                className={cn(
                  'block w-6 h-px bg-primary transition-transform duration-300',
                  open && 'rotate-45 translate-y-[6px]'
                )}
              />
              <span
                className={cn(
                  'block w-6 h-px bg-primary transition-opacity duration-300',
                  open && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'block w-6 h-px bg-primary transition-transform duration-300',
                  open && '-rotate-45 -translate-y-[6px]'
                )}
              />
            </button>

          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ───────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 backdrop-blur-xl mt-16 flex flex-col gap-2 px-8 border-t border-border/40 transition-transform duration-300 bg-background/95 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!open}
      >
        {/* Nav links */}
        <div className="flex flex-col pt-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'text-2xl font-semibold uppercase tracking-wider border-b border-border/40 py-4 transition-colors hover:text-primary',
                pathname === href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setOpen(false)}
        >
          <Link href="/contact">Get a Quote →</Link>
        </Button>
      </div>
    </>
  )
}
