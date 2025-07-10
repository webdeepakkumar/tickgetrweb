// api/create-connected-account/route.js

import Stripe from "stripe";
import { NextResponse } from "next/server";
import axios from "axios";



// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email, country, address, organizationType } = await req.json();
    

    let accountData = {
      type: "express",
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    };

    if (organizationType === "individual") {
      accountData.business_type = "individual";
      accountData.individual = {
        address: {
          line1: address,
        },
      };
    } else if (organizationType === "company") {
      accountData.business_type = "company";
      accountData.company = {
        address: {
          line1: address,
        },
      };
    }

    // const account = await stripe.accounts.create(accountData);

    const account = await axios.post('https://api.stage.noda.live/api/v1/signup',{
    
    },
    {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-api-key': '1f36480e-bf60-4580-bee4-2192d37fa309'
        }
      
    
    })
    
    await stripe.accountSessions.create({
      account: account.id,
      components: {
        account_management: { enabled: true },
        account_onboarding: { enabled: true },
        balances: { enabled: true },
        documents: { enabled: false },
        notification_banner: { enabled: false },
        payment_details: { enabled: false },
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: false,
          },
        },
        payouts: { enabled: true },
        payouts_list: { enabled: false },
      },
    });

    return NextResponse.json({ accountId: account.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe connected account:", error);
    return NextResponse.json(
      { error: "Error creating Stripe connected account" },
      { status: 500 }
    );
  }
}
