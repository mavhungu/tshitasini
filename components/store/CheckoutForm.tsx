'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { Loader2, CreditCard, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCartStore } from '@/lib/store/cartStore'

const SHIPPING_THRESHOLD = 1000
const FLAT_SHIPPING = 150

const SA_PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
]

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter your street address'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(4, 'Please enter a valid postal code'),
  country: z.string().default('South Africa'),
  paymentMethod: z.enum(['STRIPE', 'PAYPAL', 'PAYSTACK', 'OZOW']),
})

type CheckoutFormInput = z.input<typeof checkoutSchema>
type CheckoutFormData = z.output<typeof checkoutSchema>

// Reusable field error display
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive mt-1">{message}</p>
}

// Payment option definitions 

const PAYMENT_OPTIONS = [
  {
    value: 'OZOW',
    id: 'ozow',
    label: 'Instant EFT',
    description: 'Pay directly from your South African bank account — no card needed',
    icon: <Zap className="h-5 w-5 shrink-0" style={{ color: '#00CFAA' }} />,
    badge: { label: 'Ozow', bg: '#00CFAA', text: '#fff' },
    recommended: true,
  },
  {
    value: 'PAYSTACK',
    id: 'paystack',
    label: 'Card / EFT / Mobile',
    description: 'All major cards, instant EFT, and mobile money — powered by Paystack',
    icon: <BadgeDollarSign className="h-5 w-5 shrink-0" style={{ color: '#00C3F7' }} />,
    badge: { label: 'Paystack', bg: '#00C3F7', text: '#fff' },
    recommended: false,
  },
  {
    value: 'STRIPE',
    id: 'stripe',
    label: 'Pay with Card',
    description: 'Visa, Mastercard, Amex — secured by Stripe',
    icon: <CreditCard className="h-5 w-5 text-primary shrink-0" />,
    badge: { label: 'Stripe', bg: '#635BFF', text: '#fff' },
    recommended: false,
  },
  {
    value: 'PAYPAL',
    id: 'paypal',
    label: 'Pay with PayPal',
    description: 'Pay using your PayPal account or balance',
    icon: <Wallet className="h-5 w-5 text-primary shrink-0" />,
    badge: { label: 'PayPal', bg: '#003087', text: '#fff' },
    recommended: false,
  },
] as const

export function CheckoutForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const internalOrderIdRef = useRef<string | null>(null)
  const validationErrorRef = useRef<string | null>(null)

  const { items, totalPrice, clearCart } = useCartStore()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInput, never, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'South Africa',
      paymentMethod: 'PAYSTACK',
    },
  })

  const paymentMethod = watch('paymentMethod')

  useEffect(() => setMounted(true), [])

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && items.length === 0) router.push('/cart')
  }, [mounted, items.length, router])

  if (!mounted) return null

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
  const total = totalPrice + shipping

  // Creates our internal order — reused by both Stripe and PayPal flows
  const createInternalOrder = async (data: CheckoutFormData) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to create order')
    }

    const { orderId } = await res.json()
    return orderId as string
  }

  // Stripe submit handler
  const onStripeSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderId = await createInternalOrder(data)

      const stripeRes = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!stripeRes.ok) throw new Error('Failed to create Stripe session')

      const { url } = await stripeRes.json()
      // Redirect to Stripe hosted checkout
      window.location.href = url
    } catch (error) {
      toast.error('Payment failed', {
        description:
          error instanceof Error ? error.message : 'Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  // Paystack
  // appends ?trxref= on return.

  const onPaystackSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderId = await createInternalOrder(data)

      const res = await fetch('/api/payments/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const json = await res.json()
      if (!res.ok || !json.authorization_url) {
        throw new Error(json.error || 'Failed to initialise Paystack payment')
      }

      // Redirect to Paystack hosted checkout
      window.location.href = json.authorization_url
    } catch (error) {
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  // Ozow
  // appends ?trxref= to the SuccessUrl redirect.

  const onOzowSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderId = await createInternalOrder(data)

      const res = await fetch('/api/payments/ozow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const json = await res.json()
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Failed to initialise Ozow payment')
      }

      // Redirect to Ozow hosted EFT portal
      window.location.href = json.url
    } catch (error) {
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    // if (data.paymentMethod === 'STRIPE') 
    //   await onStripeSubmit(data)
    switch (data.paymentMethod) {
      case 'STRIPE':   return onStripeSubmit(data)
      case 'PAYSTACK': return onPaystackSubmit(data)
      case 'OZOW':     return onOzowSubmit(data)
      // PayPal is handled directly by <PayPalButtons> callbacks below
    }
    // PayPal is handled separately by PayPalButtons callbacks
  }

    // Submit button label

  const submitLabel = () => {
    if (isSubmitting) return null // spinner shown instead
    switch (paymentMethod) {
      case 'OZOW':     return `Pay R ${total.toFixed(2)} via Instant EFT`
      case 'PAYSTACK': return `Pay R ${total.toFixed(2)} with Paystack`
      case 'STRIPE':   return `Pay R ${total.toFixed(2)} with Card`
      default:         return null // PayPal uses its own SDK button
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

      {/* ── Checkout Form ─────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="lg:col-span-3 space-y-8"
      >

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="mt-1.5"
                {...register('firstName')}
              />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="mt-1.5"
                {...register('lastName')}
              />
              <FieldError message={errors.lastName?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="mt-1.5"
              {...register('email')}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+27 10 000 0000"
              className="mt-1.5"
              {...register('phone')}
            />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Shipping Address</h2>

          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              className="mt-1.5"
              {...register('address')}
            />
            <FieldError message={errors.address?.message} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Johannesburg"
                className="mt-1.5"
                {...register('city')}
              />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Select
                onValueChange={(val) =>
                  setValue('province', val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="province" className="mt-1.5">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {SA_PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.province?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                placeholder="2000"
                className="mt-1.5"
                {...register('postalCode')}
              />
              <FieldError message={errors.postalCode?.message} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                className="mt-1.5"
                {...register('country')}
              />
              <FieldError message={errors.country?.message} />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Payment Method</h2>

          <RadioGroup
            defaultValue="OZOW"
            onValueChange={(val) =>
              setValue('paymentMethod', val as CheckoutFormData['paymentMethod'])
            }
            className="space-y-3"
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={opt.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={opt.value} id={opt.id} />
                {opt.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{opt.label}</p>
                    {opt.recommended && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-bold px-2 py-1 rounded shrink-0"
                  style={{ background: opt.badge.bg, color: opt.badge.text }}
                >
                  {opt.badge.label}
                </span>
              </label>
            ))}
          </RadioGroup>

          <Separator />

          {/* Redirect-based payment button (Ozow, Paystack, Stripe) */}
          {paymentMethod !== 'PAYPAL' && (
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to payment…
                </>
              ) : (
                submitLabel()
              )}
            </Button>
          )}

          {/* PayPal SDK buttons — triggered by the PayPal JS SDK directly */}
          {paymentMethod === 'PAYPAL' && (
            <div className="space-y-2">
              <PayPalButtons
                style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                createOrder={async () => {
                  // Validate all fields before opening the PayPal popup
                  const isValid = await trigger()
                  if (!isValid) {
                    validationErrorRef.current =
                      'Please fill in all required fields before paying.'
                    throw new Error('Validation failed')
                  }

                  validationErrorRef.current = null
                  const values = getValues()
                  const orderId = await createInternalOrder({
                    ...values,
                    country: values.country ?? 'South Africa',
                  })
                  internalOrderIdRef.current = orderId

                  const paypalRes = await fetch('/api/payments/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'create', orderId }),
                  })

                  if (!paypalRes.ok) throw new Error('Failed to create PayPal order')

                  const { paypalOrderId } = await paypalRes.json()
                  return paypalOrderId
                }}
                onApprove={async (data) => {
                  const captureRes = await fetch('/api/payments/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'capture',
                      paypalOrderId: data.orderID,
                      orderId: internalOrderIdRef.current,
                    }),
                  })

                  if (!captureRes.ok) {
                    toast.error('Payment capture failed. Please contact support.')
                    return
                  }

                  clearCart()
                  router.push(
                    `/checkout/success?orderId=${internalOrderIdRef.current}`
                  )
                }}
                onError={() => {
                  if (validationErrorRef.current) {
                    toast.error('Please complete the form first', {
                      description: validationErrorRef.current,
                    })
                    validationErrorRef.current = null
                  } else {
                    toast.error('PayPal payment failed', {
                      description:
                        'Please try again or choose a different payment method.',
                    })
                  }
                }}
              />
            </div>
          )}
        </div>
      </form>

      {/* ── Order Summary Sidebar ─────────────── */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
          <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 max-w-[60%]">
                  {item.name}{' '}
                  <span className="text-foreground font-medium">
                    × {item.quantity}
                  </span>
                </span>
                <span className="font-medium text-foreground shrink-0">
                  R {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">R {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span className="text-foreground">R {shipping.toFixed(2)}</span>
              )}
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Free shipping on orders over R {SHIPPING_THRESHOLD}
              </p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">R {total.toFixed(2)}</span>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            🔒 Your payment is secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  )
}
