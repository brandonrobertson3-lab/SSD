export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export async function createCheckoutSession(
  amountCad: number, invoiceNumber: string, customerEmail?: string
): Promise<{ sessionId: string; url: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "cad",
        product_data: { name: `Invoice ${invoiceNumber}`, description: "Payment to PlumbVoice" },
        unit_amount: Math.round(amountCad * 100),
      },
      quantity: 1,
    }],
    customer_email: customerEmail || undefined,
    success_url: `${process.env.APP_URL || "http://localhost:5000"}/payments?success=true`,
    cancel_url: `${process.env.APP_URL || "http://localhost:5000"}/payments?cancelled=true`,
    metadata: { invoiceNumber },
  });
  return { sessionId: session.id, url: session.url! };
}
