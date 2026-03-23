import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      <Skeleton className="h-10 w-72 rounded-md" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}
