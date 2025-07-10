import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export const GET = async (req) => {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  const connected_account_id = url.searchParams.get("connected_account_id");

  if (!session_id) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 }
    );
  }

  if (!connected_account_id) {
    return NextResponse.json(
      { error: "connected_account_id is required" },
      { status: 400 }
    );
  }

  try {
    const session = await stripeClient.checkout.sessions.retrieve(session_id, {
      stripeAccount: connected_account_id,
    });

    const customerDetails = session.customer_details || {};
    const customerName = customerDetails.name || "";
    const customerEmail = customerDetails.email || "";
    const created = session.created || "";
    const amountTotal = session.amount_total || 0;
    const tQuantity = session.metadata.quantity;
    const eventName = session.metadata.eventName;
    const ticketType = session.metadata.tType;

    return NextResponse.json({
      customerName,
      customerEmail,
      created,
      amountTotal,
      tQuantity,
      ticketType,
      eventName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving session data" },
      { status: 500 }
    );
  }
};
