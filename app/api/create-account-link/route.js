// app/api/create-account-link/route.js

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { accountId, locale } = await req.json();

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }${locale}/user/profile?account_complete=${false}`,
      return_url: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }${locale}/user/profile?account_complete=${true}`,

      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    return NextResponse.json(
      { error: "Error creating Stripe account link" },
      { status: 500 }
    );
  }
}
