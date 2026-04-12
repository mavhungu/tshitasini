import { Suspense } from 'react'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
// import { Sidebar } from '@/components/admin/Sidebar'
import { Sidebar } from '@/components/admin/NewSidebar'
import { SidebarMobile } from '@/components/admin/SidebarMobile'
import { TopHeader } from '@/components/admin/TopHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
}

async function DashboardShell({ children }: DashboardLayoutProps) {
  const { user } = await withAuth()
  if (!user) redirect('/')

  const adminUser = {
    email: user.email,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    avatarInitial: (user.firstName?.[0] ?? user.email[0]).toUpperCase(),
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar user={adminUser} />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-64">
        <TopHeader user={adminUser}>
          <SidebarMobile user={adminUser} />
        </TopHeader>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-muted items-center justify-center text-zinc-400">Loading...</div>}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
