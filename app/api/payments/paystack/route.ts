/**
 * ──────────────────────────────────────────────────────────────
 * POST /api/payments/paystack
 *   Body: { orderId: string }
 *   Returns: { authorization_url: string; reference: string }
 *
 * Fetches the verified order from the DB, converts the total to
 * Paystack cents, and returns a hosted-checkout URL for the
 * client to redirect to.
 * ──────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma/client";
import {
  initializeTransaction,
  toPaystackAmount,
} from "@/lib/paystack";

// ─── Validation ──────────────────────────────────────────────────────────────

const bodySchema = z.object({
  orderId: z.string().cuid("Invalid order ID"),
});

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Parse + validate request body
    const raw = await req.json();
    const { orderId } = bodySchema.parse(raw);

    // 2. Load order (with shipping address for the callback URL)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Order has already been processed." },
        { status: 409 }
      );
    }

    if(!order.shippingAddress) {
      return NextResponse.json(
        { error: 'Order is missing a shipping address.' },
        { status: 422 }
      )
    }

    // 3. Build the Paystack reference — we use the orderId so the
    //    verify endpoint can look it up without an extra DB query.
    const reference = `PPE-${orderId}`;
    const { email, firstName, lastName } = order.shippingAddress

    // 4. Build callback URL — Paystack will append ?trxref=&reference=
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const callbackUrl = `${baseUrl}/checkout/success?orderId=${orderId}&reference=${reference}&method=paystack`;

    // 5. Initialize Paystack transaction
    const paystackData = await initializeTransaction({
      email,
      amount: toPaystackAmount(Number(order.totalAmount)),          // ZAR → cents
      reference,
      callback_url: callbackUrl,
      firstName,
      lastName,
      currency: "ZAR",
      metadata: {
        orderId,
        customerName: `${firstName} ${lastName}`,
        phone: order.shippingAddress.phone,
      },
    });

    // 6. Persist the Paystack reference on the order so the verify
    //    step can find it by reference string alone.
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: reference },
    });

    return NextResponse.json({
      authorization_url: paystackData.authorization_url,
      reference: paystackData.reference,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request.", details: err.flatten() },
        { status: 422 }
      );
    }

    console.error("[paystack/initialize]", err);
    return NextResponse.json(
      { error: "Failed to initialize Paystack payment." },
      { status: 500 }
    );
  }
}
