/**
 * ──────────────────────────────────────────────────────────────
 * Paystack REST API helpers (server-side only).
 * All requests are authenticated with the secret key via the
 * Authorization header.
 * ──────────────────────────────────────────────────────────────
 */

const PAYSTACK_BASE = "https://api.paystack.co";

/** Retrieve the secret key and throw early if it is missing. */
function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set in environment variables."
    );
  }
  return key;
}

/** Shared fetch wrapper that attaches auth + JSON headers. */
async function paystackFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const json = (await res.json()) as { status: boolean; message: string; data: T };

  if (!res.ok || !json.status) {
    throw new Error(
      `Paystack API error [${res.status}]: ${json.message}`
    );
  }

  return json.data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PaystackInitializeParams {
  /** Customer email (required by Paystack). */
  email: string;
  /**
   * Amount in the SMALLEST currency unit.
   * For ZAR this is cents, so R150.00 → 15000.
   */
  amount: number;
  /** Internal reference — use orderId for easy cross-referencing. */
  reference: string;
  /** URL Paystack redirects the customer to after payment. */
  callback_url: string;
  /** Freeform metadata stored against the transaction. */
  metadata?: Record<string, unknown>;
  /** ISO 4217 currency code.  Defaults to ZAR. */
  currency?: string;
  /** Pre-fill customer name in the Paystack UI. */
  firstName?: string;
  lastName?: string;
}

export interface PaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: string;          // "success" | "failed" | "abandoned" etc.
  reference: string;
  amount: number;          // In kobo/cents
  currency: string;
  paid_at: string;
  metadata: Record<string, unknown>;
  authorization: {
    authorization_code: string;
    card_type: string;
    last4: string;
    bank: string;
    brand: string;
  };
  customer: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

// ─── API helpers ─────────────────────────────────────────────────────────────

/**
 * Initialize a Paystack transaction.
 * Returns the hosted-payment URL to redirect the customer to.
 */
export async function initializeTransaction(
  params: PaystackInitializeParams
): Promise<PaystackInitializeResponse> {
  const body: Record<string, unknown> = {
    email: params.email,
    amount: params.amount,
    reference: params.reference,
    callback_url: params.callback_url,
    currency: params.currency ?? "ZAR",
    metadata: {
      ...params.metadata,
      custom_fields: [
        {
          display_name: "Order Reference",
          variable_name: "order_reference",
          value: params.reference,
        },
      ],
    },
  };

  // Optionally pass customer name so Paystack pre-fills the form
  if (params.firstName || params.lastName) {
    body.customer = {
      first_name: params.firstName,
      last_name: params.lastName,
    };
  }

  return paystackFetch<PaystackInitializeResponse>(
    "/transaction/initialize",
    { method: "POST", body: JSON.stringify(body) }
  );
}

/**
 * Verify a Paystack transaction by its reference string.
 * Always verify server-side — never trust a client-sent "paid" flag.
 */
export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  return paystackFetch<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}

/**
 * Convert a Rand (ZAR) amount to Paystack cents.
 * e.g.  150.00  →  15000
 */
export function toPaystackAmount(randAmount: number): number {
  return Math.round(randAmount * 100);
}
