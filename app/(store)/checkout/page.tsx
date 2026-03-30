import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/store/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order from Tshitasini Enviro Solutions.',
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-28 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground mt-1">
          Complete your details below to place your order
        </p>
      </div>
      <CheckoutForm />
    </div>
  )
}
