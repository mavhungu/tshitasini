import { authkitMiddleware } from '@workos-inc/authkit-nextjs'

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      '/',
      '/products',
      '/products/(.*)',
      '/about',
      '/contact',
      '/refund-policy',
      '/cart',
      '/checkout',
      '/checkout/(.*)',
      '/api/products(.*)',
      '/api/orders(.*)',
      '/api/payments(.*)',
      '/api/contact(.*)',
    ],
  },
})

export const config = {
  // Apply middleware to all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}