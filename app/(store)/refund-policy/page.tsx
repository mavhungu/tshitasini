import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, RefreshCw, XCircle, Clock, Phone, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Learn about the refund, return, and cancellation policy for orders placed with Tshitasini Enviro Solutions.',
}

const sections = [
  {
    icon: RefreshCw,
    title: 'Returns & Refunds',
    content: [
      {
        heading: 'Eligibility for Returns',
        body: `We accept returns within 7 (seven) business days of the confirmed delivery date, provided the following conditions are met:

          - The product is unused, unopened, and in its original packaging
          - The product has not been tampered with or removed from its sealed packaging
          - Proof of purchase (order confirmation or invoice) is provided
          - The return request is submitted within the stipulated 7-day window`,
      },
      {
        heading: 'Non-Returnable Items',
        body: `Due to the nature of medical and safety products, the following items cannot be returned or refunded:

          - Opened or used PPE products (gloves, masks, gowns, face shields)
          - Products that have been removed from sterile or sealed packaging
          - Custom or bulk-order items manufactured or sourced specifically for a client
          - Products damaged due to misuse, improper storage, or negligence after delivery
          - Items purchased on clearance or marked as final sale`,
      },
      {
        heading: 'Refund Process',
        body: `Once a return request is approved:

          - Approved refunds are processed within 7–10 business days of receiving the returned goods
          - Refunds are issued to the original payment method (Stripe card or PayPal account)
          - Shipping costs are non-refundable unless the return is due to our error (e.g. wrong item shipped, defective product)
          - You will receive an email confirmation once your refund has been processed`,
      },
    ],
  },
  {
    icon: XCircle,
    title: 'Order Cancellations',
    content: [
      {
        heading: 'Cancellation by Customer',
        body: `You may request an order cancellation under the following conditions:

          - Cancellation requests must be submitted within 24 hours of placing your order
          - Orders that have already been dispatched or are in transit cannot be cancelled
          - To request a cancellation, contact us immediately via email or phone with your order reference number
          - If the cancellation is approved before dispatch, a full refund will be issued within 5–7 business days`,
      },
      {
        heading: 'Bulk & Custom Orders',
        body: `For bulk orders or custom-sourced PPE products:

          - Cancellations must be requested within 2 hours of order confirmation
          - Orders already in production, procurement, or dispatch cannot be cancelled
          - A cancellation fee may apply for orders that have entered the procurement process
          - All bulk order cancellation requests must be submitted in writing via email`,
      },
      {
        heading: 'Cancellation by Tshitasini Enviro Solutions',
        body: `We reserve the right to cancel an order under the following circumstances:

          - Product is out of stock or no longer available
          - Suspected fraudulent transaction or payment verification failure
          - Incorrect pricing due to a system error
          - Inability to fulfil delivery to the specified address

          In such cases, you will be notified promptly and a full refund will be issued within 5–7 business days.`,
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Defective or Incorrect Products',
    content: [
      {
        heading: 'Wrong Item Received',
        body: `If you receive an item different from what you ordered, please contact us within 48 hours of delivery. We will arrange:

          - Collection of the incorrect item at no cost to you
          - Dispatch of the correct item as soon as possible
          - Or a full refund if the correct item is unavailable`,
      },
      {
        heading: 'Damaged or Defective Products',
        body: `If your order arrives damaged or defective:

          - Notify us within 48 hours of delivery with photographic evidence
          - We will assess the claim and respond within 2 business days
          - Approved claims will result in a replacement or full refund at our discretion
          - We do not accept damage claims for products that were damaged after delivery due to improper handling or storage`,
      },
    ],
  },
  {
    icon: Clock,
    title: 'Important Timeframes',
    content: [
      {
        heading: 'Summary of Key Deadlines',
        body: `• Return request window: 7 business days from delivery
          - Order cancellation window: 24 hours from order placement
          - Bulk/custom order cancellation: 2 hours from confirmation
          - Defective/wrong item report: 48 hours from delivery
          - Refund processing time: 7–10 business days after approval
          - Cancellation refund time: 5–7 business days after approval`,
      },
    ],
  },
]

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-28 pb-12">

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
          Legal
        </p>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          At Tshitasini Enviro Solutions, we are committed to ensuring your
          satisfaction with every order. Please read this policy carefully before
          placing an order. By completing a purchase on our platform you agree to
          the terms outlined below.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Last updated: {new Date().toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <Separator className="mb-10" />

      {/* Policy sections */}
      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.title}>
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg shrink-0">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {section.title}
              </h2>
            </div>

            {/* Sub-sections */}
            <div className="space-y-6 pl-0 md:pl-12">
              {section.content.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="mt-10" />
          </div>
        ))}
      </div>

      {/* Governing law */}
      <div className="mt-10 mb-10">
        <h2 className="text-xl font-bold text-foreground mb-3">
          Governing Law
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This policy is governed by the laws of the Republic of South Africa,
          including but not limited to the Consumer Protection Act 68 of 2008
          and the Electronic Communications and Transactions Act 25 of 2002.
          Any disputes arising from this policy shall be subject to the
          jurisdiction of the South African courts.
        </p>
      </div>

      <Separator className="mb-10" />

      {/* Contact section */}
      <div className="bg-muted rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Need Help With a Return or Cancellation?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Our team is here to assist you. Please reach out with your order
          reference number and we will respond within one business day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <span>info@tshitasini.co.za</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <span>+27 10 000 0000</span>
          </div>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>

    </div>
  )
}
