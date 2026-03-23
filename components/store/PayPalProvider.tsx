'use client'

import { PayPalProvider } from '@paypal/react-paypal-js/sdk-v6'

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalProvider
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}
      currency="ZAR"
      pageType="checkout"
      components={['paypal-payments']}
    >
      {children}
    </PayPalProvider>
  )
}
