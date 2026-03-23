'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOutAction } from '@/lib/actions/auth'
const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Add Product',
    href: '/dashboard/products/new',
    icon: PlusCircle,
    exact: true,
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: Package,
    exact: false,
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    exact: false,
  },
]
interface SidebarNavProps {
  onNavigate?: () => void
}
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)
  return (
    <nav className="space-y-1" aria-label="Admin navigation">
      {/* Nav links */}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.href, item.exact)
              ? 'bg-primary text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </Link>
      ))}
      {/* Divider */}
      <div className="border-t border-zinc-700/50 my-3" />
      {/* View store link */}
      <Link
        href="/"
        target="_blank"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <Package className="h-4 w-4 shrink-0" />
        View Store
      </Link>
      {/* Logout */}
      <form action={signOutAction} >
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </form>
    </nav>
  )
}
