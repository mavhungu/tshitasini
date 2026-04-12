'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Leaf, LogOut, Settings, Home,
  Monitor, Sun, Moon, ExternalLink,
} from 'lucide-react'
import { SidebarNav } from './SidebarNav'
import { signOutAction } from '@/lib/actions/auth'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarUser {
  email: string
  firstName: string
  lastName: string
  avatarInitial: string
}

function displayName(user: SidebarUser): string {
  if (user.firstName) {
    return user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName
  }
  const prefix = user.email.split('@')[0]
  return prefix
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

// ── Theme switcher ────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'system',  icon: Monitor },
    { value: 'light',   icon: Sun },
    { value: 'dark',    icon: Moon },
  ]

  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <span className="text-foreground">Theme</span>
      <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
        {options.map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'p-1.5 rounded transition-colors',
              theme === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={`${value} theme`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Popover menu item ─────────────────────────────────────────────────────────

function MenuItem({
  icon: Icon,
  label,
  href,
  onClick,
  variant = 'default',
}: {
  icon: React.ElementType
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'destructive'
}) {
  const base = cn(
    'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
    variant === 'destructive'
      ? 'text-foreground hover:text-destructive hover:bg-destructive/10'
      : 'text-foreground hover:bg-accent'
  )

  const content = (
    <>
      <span>{label}</span>
      <Icon className={cn(
        'h-4 w-4',
        variant === 'destructive' ? 'text-muted-foreground' : 'text-muted-foreground'
      )} />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={base}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {content}
    </button>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar({ user }: { user: SidebarUser }) {
  const name = displayName(user)

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-700/50 shrink-0">
        <div className="p-1.5 bg-primary rounded-lg">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-white text-sm">VaultSafe</p>
          <p className="text-xs text-zinc-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>

      {/* User card trigger */}
      <div className="shrink-0 border-t border-zinc-700/50 p-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors group">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.avatarInitial}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate leading-tight">
                  {name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate leading-tight mt-0.5">
                  {user.email}
                </p>
              </div>
              {/* ··· */}
              <div className="flex flex-col gap-[3px] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
              </div>
            </button>
          </PopoverTrigger>

          {/* ── Popover menu ──────────────────────────────────────────────── */}
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-72 p-0 bg-popover border border-border shadow-xl rounded-xl overflow-hidden"
          >
            {/* User header */}
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {user.avatarInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate leading-tight">
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                aria-label="Dashboard settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>

            <Separator />

            {/* Menu items */}
            <div className="p-1.5 space-y-0.5">
              <ThemeToggle />
              <MenuItem icon={Home} label="View Store" href="/" />
              <MenuItem icon={ExternalLink} label="Store Products" href="/products" />
            </div>

            <Separator />

            {/* Log out */}
            <div className="p-1.5">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <span>Log Out</span>
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>
            </div>

          </PopoverContent>
        </Popover>
      </div>

    </aside>
  )
}
