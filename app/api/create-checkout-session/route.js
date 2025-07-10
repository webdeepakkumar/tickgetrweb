import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req) => {
  const {
    accountId,
    description,
    amount,
    ticketType,
    quantity,
    pOnCharges,
    referralSource,
    eventId,
    ticketIndex,
    eventName,
    eStart,
    discountPercent,
    uEmail,
    userId,
    locale,
    
  } = await req.json();

  //calculate total amount
  // const nodaExtrafee = 0.4;
  const platformfee = 0.35;
  const totalBeforeDiscount = pOnCharges ? (amount +  platformfee) * quantity : (amount) *quantity ;
  const discountAmount = (totalBeforeDiscount * discountPercent) / 100;
  const totalAmount = parseFloat((totalBeforeDiscount - discountAmount).toFixed(2));
  const discount = discountPercent;

  //getting userIp Adress
  const ipresponse = await axios.get("https://api64.ipify.org?format=json");
  const userIp = ipresponse.data.ip;
  const paymentId = "PID" + Math.floor(Math.random() * 10000000000);

  //remove extra slash from the base url
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  // const baseUrl = "http://localhost:3000";

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    return NextResponse.json({ error: "Base URL is not defined" }, { status: 500 });
  }
  
  if (!process.env.NODA_API_KEY) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  try {
    const options = await axios.post(
      `${process.env.NODA_URL}/api/payments`,
      {
        amount: totalAmount,
        currency: "EUR",
        returnUrl: `${baseUrl}/${locale}/events/${encodeURIComponent(eventName)}`,
        paymentId: paymentId,
        webhookUrl: `${baseUrl}/api/webhook?key=${process.env.NODA_API_KEY}`,
        description: description,
        email: uEmail,
        ipAddress: userIp,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-key": process.env.NODA_API_KEY,
        },
      }
    );
    const url = options.data.url;
    const transcation_id = options.data.id;

    //sent the checkout url and transaction id to the fronted

    if (url) {
      return NextResponse.json(
        { url: options.data.url, transcation_id: options.data.id , ticketType:  ticketType, eStart:eStart , paymetnId: paymentId,discount: discount},
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "url is not found " },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
