import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import { StatCard } from '@/components/admin/StatCard'
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable'

export default async function DashboardPage() {
  const { user } = await withAuth()
  if (!user) redirect('/')

  // Fetch all dashboard stats in parallel
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        shippingAddress: true,
        items: true,
      },
    }),
  ])

  const totalRevenue = Number(revenueResult._sum.totalAmount ?? 0)

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      description: `${activeProducts} active`,
      color: 'blue' as const,
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      description: 'All time',
      color: 'green' as const,
    },
    {
      title: 'Total Revenue',
      value: `R ${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      description: 'From paid orders',
      color: 'purple' as const,
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: Users,
      description: `${totalProducts - activeProducts} inactive`,
      color: 'orange' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back,{' '}
          <span className="font-semibold text-foreground">
            {user.firstName || user.email}
          </span>
          . Here is what is happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Recent Orders
        </h2>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  )
}
