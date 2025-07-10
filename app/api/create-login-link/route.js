// /api/create-login-link/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json(
        { error: "Stripe account number is required" },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.retrieve(accountId);

    if (account.capabilities.transfers === "active") {
      const dashboardLink = await stripe.accounts.createLoginLink(accountId);

      return NextResponse.json(
        { dashboardUrl: dashboardLink.url, accountComplete: true },
        { status: 200 }
      );
    } else {
      const requirements = account.requirements;
      return NextResponse.json(
        {
          error: "Account has not completed onboarding",
          requirements: requirements,
          accountComplete: false,
          dashboardUrl: "",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating dashboard link" },
      { status: 500 }
    );
  }
}
