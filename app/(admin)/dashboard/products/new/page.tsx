import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const { user } = await withAuth()
  if (!user) redirect('/')

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to add a new product to your catalogue.
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
