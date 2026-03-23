'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ImageUploader } from '@/components/admin/ImageUploader'

const CATEGORIES = [
  'Gloves', 'Masks', 'Gowns', 'Eye Protection',
  'Face Shields', 'Shoe Covers', 'Sanitisers', 'Other',
]

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Please select a category'),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: ProductFormData & { id: string }
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      images: [],
      isActive: true,
    },
  })

  const isActive = watch('isActive')
  const nameValue = watch('name')
  const images = watch('images')

  const slugPreview = nameValue
    ? nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : ''

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const url = isEdit
        ? `/api/products/${initialData.id}`
        : '/api/products'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to save product')
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      router.push('/dashboard/products')
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Main Details ──────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Name */}
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Latex Surgical Gloves (Size M)"
                  className="mt-1.5"
                  {...register('name')}
                />
                {slugPreview && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Slug: <span className="font-mono">{slugPreview}</span>
                  </p>
                )}
                <FieldError message={errors.name?.message} />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product — material, size, compliance standards..."
                  rows={5}
                  className="mt-1.5"
                  {...register('description')}
                />
                <FieldError message={errors.description?.message} />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (R) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="mt-1.5"
                    {...register('price')}
                  />
                  <FieldError message={errors.price?.message} />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="mt-1.5"
                    {...register('stock')}
                  />
                  <FieldError message={errors.stock?.message} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Image Upload Card ──────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Product Images
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  Up to 5 images — first image is the main display image
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={images}
                onChange={(urls) =>
                  setValue('images', urls, { shouldValidate: true })
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ───────────────────────── */}
        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  defaultValue={initialData?.category}
                  onValueChange={(val) =>
                    setValue('category', val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.category?.message} />
              </div>

              <Separator />

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Visible in the store
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(val) => setValue('isActive', val)}
                  aria-label="Toggle product active status"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push('/dashboard/products')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
