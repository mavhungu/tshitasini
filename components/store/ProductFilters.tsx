'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  categories: string[]
  currentCategory: string | null
  currentSort: string | null
  currentSearch: string | null
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentSearch,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch ?? '')

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleCategory = (cat: string | null) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ category: cat })}`)
    })
  }

  const handleSort = (value: string) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({ sort: value === 'newest' ? null : value })}`
      )
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({ search: searchValue || null })}`
      )
    })
  }

  const handleClearAll = () => {
    setSearchValue('')
    startTransition(() => router.push(pathname))
  }

  const hasActiveFilters = !!(currentCategory || currentSort || currentSearch)

  const filterContent = (
    <div className={cn('space-y-6', isPending && 'opacity-60 pointer-events-none')}>
      {/* Search */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Search</Label>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="outline" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Sort By</Label>
        <Select value={currentSort ?? 'newest'} onValueChange={handleSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Category</Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategory(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              !currentCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                currentCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="w-full text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — bg-card replaces bg-white */}
      <div className="hidden lg:block bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
              Active
            </Badge>
          )}
        </div>
        {filterContent}
      </div>

      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-1 bg-primary text-primary-foreground text-xs">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
