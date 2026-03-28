/**
 * ──────────────────────────────────────────────────────────────
 * GET /api/payments/paystack/verify?reference=PPE-<orderId>
 *
 * Called from the success page to confirm payment before
 * showing the order confirmation UI.
 *
 * Flow:
 *   1. Verify the reference with Paystack's REST API
 *   2. Confirm the returned amount matches the stored order total
 *   3. Mark the order PAID in the database
 *   4. Return sanitised order data for the success page
 * ──────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { verifyTransaction, toPaystackAmount } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "Missing reference parameter." },
      { status: 400 }
    );
  }

  try {
    // 1. Verify with Paystack — throws if the reference is unknown
    const txn = await verifyTransaction(reference);

    if (txn.status !== "success") {
      return NextResponse.json(
        {
          error: `Payment was not successful. Status: ${txn.status}`,
          paystackStatus: txn.status,
        },
        { status: 402 }
      );
    }

    // 2. Find the order by the stored reference
    const order = await prisma.order.findFirst({
      where: { paymentReference: reference },
      include: {
        orderItems: {
          include: { product: { select: { name: true, images: true } } },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found for this payment reference." },
        { status: 404 }
      );
    }

    // 3. Guard against amount tampering — compare DB total with
    //    what Paystack actually charged (both in cents).
    const expectedCents = toPaystackAmount(order.total);
    if (txn.amount !== expectedCents) {
      console.error(
        `[paystack/verify] Amount mismatch: expected ${expectedCents}, got ${txn.amount}`,
        { orderId: order.id, reference }
      );
      return NextResponse.json(
        { error: "Payment amount mismatch. Please contact support." },
        { status: 409 }
      );
    }

    // 4. Idempotent update — only transition PENDING → PAID
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentId: txn.reference,          // Paystack's own reference
          paidAt: new Date(txn.paid_at),
          paymentMethod: "PAYSTACK",
        },
      });
    }

    // 5. Return the data the success page needs
    return NextResponse.json({
      orderId: order.id,
      status: "PAID",
      reference: txn.reference,
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      paymentMethod: "PAYSTACK",
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      items: order.orderItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice,
        image: item.product.images?.[0] ?? null,
      })),
    });
  } catch (err) {
    console.error("[paystack/verify]", err);
    return NextResponse.json(
      { error: "Failed to verify payment. Please contact support." },
      { status: 500 }
    );
  }
}
