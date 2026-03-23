import { Skeleton } from '@/components/ui/skeleton'

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  )
}
