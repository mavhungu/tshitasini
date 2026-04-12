import Link from 'next/link'
import { SidebarNav } from './SidebarNav'
import { Leaf, LogOut } from 'lucide-react'
import { signOutAction } from '@/lib/actions/auth'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function Sidebar({ user }: { user: SidebarUser }) {
  const name = displayName(user)
  
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-700/50">
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

      {/* Admin user card */}
      {/*<div className="shrink-0 border-t border-zinc-700/50">*/}
        {/* <div className="flex items-center gap-3 px-4 py-4">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user.firstName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
          </div>
        </div> */}

      {/*<div className="px-3 py-4">*/}
          {/* Logout */}
          {/*<form action={signOutAction} >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </form>
        </div>*/}

{/* User card — opens popover on click */}
      <div className="shrink-0 border-t border-zinc-700/50 p-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors group">
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.avatarInitial}
              </div>
 
              {/* Name + email */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate leading-tight">
                  {name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate leading-tight mt-0.5">
                  {user.email}
                </p>
              </div>
 
              {/* Ellipsis indicator */}
              <div className="flex flex-col gap-[3px] shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
                <span className="block h-[3px] w-[3px] rounded-full bg-zinc-400" />
              </div>
            </button>
          </PopoverTrigger>
 
          {/* Popover — opens above the trigger */}
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-64 p-0 bg-popover border border-border shadow-lg rounded-xl overflow-hidden"
          >
            {/* User info header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {user.avatarInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-tight">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
 
            {/* Actions */}
            <div className="py-1">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  Log out
                </button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
    </aside>
  )
}
