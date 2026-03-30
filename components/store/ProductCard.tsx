import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
  price: number | string
  category: string
  images: string[]
  stock: number
}

export function ProductCard({ product }: { product: Product }) {
  const price =
    typeof product.price === 'string'
      ? parseFloat(product.price)
      : product.price
  const outOfStock = product.stock === 0

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-top transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground text-xs">
            {product.category}
          </Badge>
        </div>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-background text-foreground text-sm font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 pb-2">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-bold text-primary">
          R {price.toFixed(2)}
        </p>
      </CardContent>

      {/* Action */}
      <CardFooter className="p-4 pt-2">
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={outOfStock}
        >
          <Link href={`/products/${product.slug}`}>View Product</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardContent className="p-4 pb-2 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
