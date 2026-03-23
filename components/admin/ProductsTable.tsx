'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  images: string[]
  isActive: boolean
  createdAt: Date
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = async (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      })
      if (res.ok) {
        toast.success(`Product ${!current ? 'activated' : 'deactivated'}`)
        router.refresh()
      } else {
        toast.error('Failed to update product status')
      }
    })
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setDeletingId(null)

    if (res.ok) {
      toast.success('Product deleted')
      router.refresh()
    } else {
      const err = await res.json()
      toast.error(err.message || 'Failed to delete product')
    }
  }

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No products yet.</p>
        <Button asChild>
          <Link href="/dashboard/products/new">Add your first product</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50">

                {/* Product name + image */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-sm text-foreground line-clamp-1 max-w-[160px]">
                      {product.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </TableCell>

                <TableCell className="font-semibold text-sm text-foreground">
                  R {product.price.toFixed(2)}
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <span
                    className={`text-sm font-medium ${
                      product.stock === 0
                        ? 'text-destructive'
                        : product.stock <= 10
                        ? 'text-orange-500'
                        : 'text-foreground'
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>

                <TableCell>
                  <Switch
                    checked={product.isActive}
                    disabled={isPending}
                    onCheckedChange={() =>
                      handleToggleActive(product.id, product.isActive)
                    }
                    aria-label={`Toggle ${product.name} active status`}
                  />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete{' '}
                            <strong>{product.name}</strong>. This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                          >
                            {deletingId === product.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  No products match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
