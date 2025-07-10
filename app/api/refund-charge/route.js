// api/refund-charge/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { accountId, chargeId, amount, reason, refundApplicationFee } =
      await req.json();

    const refundParams = {
      charge: chargeId,
    };

    if (amount) {
      refundParams.amount = amount;
    }

    if (reason) {
      refundParams.reason = reason;
    }

    if (refundApplicationFee) {
      refundParams.refund_application_fee = true;
    }

    const refund = await stripe.refunds.create(refundParams, {
      stripeAccount: accountId,
    });

    const refundId = refund.id;
    const refundDate = refund.created * 1000;

    return NextResponse.json({ refundId, refundDate }, { status: 200 });
  } catch (error) {
    console.error("Error creating refund:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
