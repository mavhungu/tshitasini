'use client'

import { PayPalProvider } from '@paypal/react-paypal-js/sdk-v6'

export function PayPalsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalProvider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}
      pageType="checkout"
      components={['paypal-payments']}
    >
      {children}
    </PayPalProvider>
  )
}
