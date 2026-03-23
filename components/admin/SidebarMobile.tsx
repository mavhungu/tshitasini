'use client'

import { useState } from 'react'
import { Menu, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarNav } from './SidebarNav'

interface SidebarUser {
  email: string
  firstName: string
  lastName: string
  avatarInitial: string
}

export function SidebarMobile({ user }: { user: SidebarUser }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 bg-zinc-900 text-white p-0 border-zinc-700"
      >
        <SheetHeader className="px-6 py-5 border-b border-zinc-700/50">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="p-1.5 bg-primary rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight text-left">
              <p className="font-bold text-sm">Tshitasini</p>
              <p className="text-xs text-zinc-400 font-normal">Admin Panel</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>

        {/* User card */}
        <div className="border-t border-zinc-700/50 px-4 py-4">
          <div className="flex items-center gap-3">
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
