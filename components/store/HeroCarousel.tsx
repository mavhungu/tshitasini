'use client'

import * as React from 'react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    description: 'Latex, nitrile, and vinyl options meeting SABS and WHO standards. Supplied to hospitals and clinics across South Africa.',
    primaryCta: { label: 'Shop Gloves', href: '/products?category=Gloves' },
    secondaryCta: { label: 'Get a Quote', href: '/contact' },
    bg: 'from-primary/90 via-primary to-primary/800',
  },
  {
    heading: 'Medical-Grade',
    highlight: 'Face Masks & Shields',
    description: 'N95, surgical, and 3-ply masks with full face shield options. Protecting healthcare workers every day.',
    primaryCta: { label: 'Shop Masks', href: '/products?category=Masks' },
    secondaryCta: { label: 'View All PPE', href: '/products' },
    bg: 'from-primary/900 via-primary/800 to-primary',
  },
  {
    heading: 'Protective',
    highlight: 'Eye & Face Equipment',
    description: 'Anti-fog goggles, safety glasses, and full face shields designed for healthcare and industrial environments.',
    primaryCta: { label: 'Shop Eye Protection', href: '/products?category=Eye+Protection' },
    secondaryCta: { label: 'Contact Us', href: '/contact' },
    bg: 'from-emerald-900 via-primary/800 to-primary/700',
  },
  {
    heading: 'Full PPE Kits',
    highlight: 'For Your Facility',
    description:
      'Complete head-to-toe protection packages for hospitals, clinics, pharmacies, and industrial workplaces at competitive bulk pricing.',
    primaryCta: { label: 'Browse All Products', href: '/products' },
    secondaryCta: { label: 'Request a Quote', href: '/contact' },
    bg: 'from-primary/800 via-primary to-emerald-700',
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
                  'relative bg-gradient-to-br text-background min-h-[calc(100vh-4rem)] flex items-center',
                  slide.bg
                )}
              >
                {/* Subtle dot pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,background_1px,transparent_1px)] bg-[length:40px_40px]" />

                <div className="container mx-auto px-6 sm:py-10 md:px-16 lg:px-20 py-12 sm:py-16 md:py-24 relative z-10">
                  <div className="max-w-2xl">

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                      {slide.heading}{' '}
                      <br />
                      <span className="text-primary-200">{slide.highlight}</span>
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-primary/100 mb-8 leading-relaxed max-w-lg">
                      {slide.description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-background text-primary hover:bg-primary/50 hover:text-primary-foreground border border-primary-foreground/20 font-semibold"
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
                        className="border-background text-background hover:bg-background/10 bg-transparent"
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
                              ? 'w-6 bg-background'
                              : 'w-1.5 bg-background/40 hover:bg-background/60'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slide counter */}
                <div className="absolute bottom-6 right-6 text-background/40 text-xs font-mono hidden md:block">
                  {String(current + 1).padStart(2, '0')} /{' '}
                  {String(count).padStart(2, '0')}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        <CarouselPrevious className="left-4 md:left-8 bg-background/10 hover:bg-background/20 border-background/20 text-background hover:text-background disabled:opacity-30" />
        <CarouselNext className="right-4 md:right-8 bg-background/10 hover:bg-background/20 border-background/20 text-background hover:text-background disabled:opacity-30" />
      </Carousel>
    </section>
  )
}
