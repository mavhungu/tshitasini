import Link from 'next/link'
import { SidebarNav } from './SidebarNav'
import { Leaf, LogOut } from 'lucide-react'
import { signOutAction } from '@/lib/actions/auth'

interface SidebarUser {
  email: string
  firstName: string
  lastName: string
  avatarInitial: string
}

export function Sidebar({ user }: { user: SidebarUser }) {
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white z-40">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-700/50">
        <div className="p-1.5 bg-primary rounded-lg">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-white text-sm">Tshitasini</p>
          <p className="text-xs text-zinc-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>

      {/* Admin user card */}
      <div className="shrink-0 border-t border-zinc-700/50">
        <div className="flex items-center gap-3 px-4 py-4">
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
        </div>

        <div className="px-3 pb-4">
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
        </div>

      </div>
    </aside>
  )
}
