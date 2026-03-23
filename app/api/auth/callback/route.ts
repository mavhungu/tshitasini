import { handleAuth } from '@workos-inc/authkit-nextjs'

// WorkOS redirects here after successful login
// handleAuth() exchanges the code for a session and redirects to /dashboard
export const GET = handleAuth({ returnPathname: '/dashboard' })
