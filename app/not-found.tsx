import Link from 'next/link'
import { FileQuestion, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="inline-flex p-5 bg-primary/10 rounded-full mb-6">
            <FileQuestion className="h-14 w-14 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The page you are looking for does not exist or may have been moved.
            Let us get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
