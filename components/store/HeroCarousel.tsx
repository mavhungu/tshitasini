'use client'

import * as React from 'react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

const heroSlides = [
  {
    heading: 'Certified Surgical',
    highlight: 'Gloves & Gowns',
    description:
      'Latex, nitrile, and vinyl options meeting SABS and WHO standards. Supplied to hospitals and clinics across South Africa.',
    primaryCta: { label: 'Shop Gloves', href: '/products?category=Gloves' },
    secondaryCta: { label: 'Get a Quote', href: '/contact' },
    bg: 'from-primary/90 via-primary to-green-800',
  },
  {
    heading: 'Medical-Grade',
    highlight: 'Face Masks & Shields',
    description:
      'N95, surgical, and 3-ply masks with full face shield options. Protecting healthcare workers every day.',
    primaryCta: { label: 'Shop Masks', href: '/products?category=Masks' },
    secondaryCta: { label: 'View All PPE', href: '/products' },
    bg: 'from-green-900 via-green-800 to-primary',
  },
  {
    heading: 'Protective',
    highlight: 'Eye & Face Equipment',
    description:
      'Anti-fog goggles, safety glasses, and full face shields designed for healthcare and industrial environments.',
    primaryCta: { label: 'Shop Eye Protection', href: '/products?category=Eye+Protection' },
    secondaryCta: { label: 'Contact Us', href: '/contact' },
    bg: 'from-emerald-900 via-green-800 to-green-700',
  },
  {
    heading: 'Full PPE Kits',
    highlight: 'For Your Facility',
    description:
      'Complete head-to-toe protection packages for hospitals, clinics, pharmacies, and industrial workplaces at competitive bulk pricing.',
    primaryCta: { label: 'Browse All Products', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact' },
    bg: 'from-green-800 via-primary to-emerald-700',
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  // Autoplay plugin — pauses on hover, resumes on leave
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  // Sync current slide index with Embla API
  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className={cn(
                  'relative bg-gradient-to-br text-white min-h-[calc(100vh-4rem)] flex items-center',
                  slide.bg
                )}
              >
                {/* Subtle dot pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px)] bg-[length:40px_40px]" />

                <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
                  <div className="max-w-2xl">

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                      {slide.heading}{' '}
                      <br />
                      <span className="text-green-200">{slide.highlight}</span>
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-green-100 mb-8 leading-relaxed max-w-lg">
                      {slide.description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-white text-primary hover:bg-green-50 font-semibold"
                      >
                        <Link href={slide.primaryCta.href}>
                          {slide.primaryCta.label}{' '}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 bg-transparent"
                      >
                        <Link href={slide.secondaryCta.href}>
                          {slide.secondaryCta.label}
                        </Link>
                      </Button>
                    </div>

                    {/* ✅ Dot indicators — driven by actual Embla API state */}
                    <div className="flex items-center gap-2 mt-10">
                      {Array.from({ length: count }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => api?.scrollTo(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-300',
                            i === current
                              ? 'w-6 bg-white'
                              : 'w-1.5 bg-white/40 hover:bg-white/60'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slide counter */}
                <div className="absolute bottom-6 right-6 text-white/40 text-xs font-mono hidden md:block">
                  {String(current + 1).padStart(2, '0')} /{' '}
                  {String(count).padStart(2, '0')}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        <CarouselPrevious className="left-4 md:left-8 bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white disabled:opacity-30" />
        <CarouselNext className="right-4 md:right-8 bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white disabled:opacity-30" />
      </Carousel>
    </section>
  )
}
