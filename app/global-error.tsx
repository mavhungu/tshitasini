'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// global-error.tsx replaces the root layout when it fires
// so it must include its own <html> and <body> tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-5 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="h-14 w-14 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            An unexpected error occurred. Please try refreshing the page.
            If the issue persists, please contact our support team.
          </p>
          <Button
            onClick={reset}
            size="lg"
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </body>
    </html>
  )
}
