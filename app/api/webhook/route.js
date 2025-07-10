import { NextResponse } from "next/server";
import { updatePaymentStatusByTransactionId } from "@/app/(Api)/firebase/firebase_firestore";
import { updateTicket } from "@/app/(Api)/firebase/firebase_firestore";
import axios from "axios";
import { addBuyers } from "@/app/(Api)/firebase/firebase_firestore";
import { updateTicketField } from "@/app/(Api)/firebase/firebase_firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      ...body,
    };
    console.log("Received webhook:", logEntry);
    const Iban = logEntry?.Remitter.Iban;
    const BankId = logEntry?.BankId;
    console.log("Original BankId:", BankId);
    let modifybankId = "";
    let bankId = "";

    if (BankId) {
      function transformBankId(bankId) {
        let parts = bankId.split("_");
        if (parts.length >= 2) {
          return parts[0] + " " + parts[1];
        }
        return bankId;
      }
      modifybankId = transformBankId(BankId);
      bankId = modifybankId.toUpperCase();
    }
    if (!logEntry || !Iban) {
      console.error("something went wrong in Webhook");
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
    bankId = modifybankId.toUpperCase();
    const buyerdetails = await updatePaymentStatusByTransactionId(logEntry,Iban,bankId);
    const {
      buyerEmail,
      buyerName,
      buyerId,
      amountPaid,
      tquantity,
      tickettype,
      discount,
      uEmail,
      eName,
      paymentMethod,
      eStart,
      eventId,
      referrals,
    } = buyerdetails;
    //update ticket
    console.log(buyerdetails)
    let tQrCode = "";
    try {
      const buyerData = {
        bEmail: buyerEmail,
        bName: buyerName,
        tOrderTime: new Date(),
        eId: eventId,
        buyerId: buyerId,
        tPrice: amountPaid,
        tQuantity: tquantity,
        tQrCode: "",
        tIsScanned: true,
        tType: "fsfsfsdf",
        isValid: true,
        payment_method: paymentMethod,
        referrals: referrals,
        chargeId: "",
        isRefunded: false,
        refundId: "",
        discountPercent: discount || 0,
        cardDigits: "",
        refundAmount: parseFloat(0.0),
      };

      const buyerdatacode = await addBuyers(buyerData);
      if (!buyerdatacode || !buyerdatacode.code) {
        console.log("No new buyer created or QR code is missing.");
        return;
      }
      tQrCode = buyerdatacode.code;
      await updateTicket(eventId, tquantity, tickettype);
    } catch (error) {
      console.error("Error updating ticket quantity:", error);
    }
    try {
      const response = await axios.post(`${baseUrl}/api/send-email`, {
        to: buyerEmail,
        bName: buyerName,
        tQrCode: tQrCode,
        tType: tickettype,
        amountPaid: amountPaid,
        tQuantity: tquantity,
        tUID: process.env.NEXT_PUBLIC_MAILTRAP_TICKET_TID,
        eventName: eName,
        uEmail: uEmail,
        eStart: eStart,
        paymentMethod:paymentMethod,
        // cardDigits: buyerData.cardDigits,
      });
      console.log("email send sucessfully");
    } catch (error) {
      console.error(`Sending email to: ${buyerEmail} unsuccessful ${error}`);
    }
    return NextResponse.json(
      { message: "Webhook data saved in transation" },
      { status: 200 }
    );
  } catch (error) {
    console.error("webhook data is already saved :");
    return NextResponse.json(
      {message:"webhook data is no saved so that why the email and the ticket is not reduce"},
      {status:400}
    )
  }
}

// // timestamp: '2025-03-03T11:30:38.950Z',
//   PaymentId: 'd958f197-2acc-4f2d-a32d-1028bdffa2b7',
//   Status: 'Done',
//   Signature: 'edb7a2506052670f4d4f7a8442b57a9efdb45c06f2455cda05bd627c52c71d11',
//   MerchantPaymentId: '119318-123-test-2',
//   Reference: 'OWFH3R49 PAYMENT',
//   Amount: 1.24,
//   Currency: 'EUR',
//   CardId: null,
//   Remitter: {
//     Name: 'John Smith',
//    Iban: 'DE99990001741001414599',
//     SortCode: null,
//     AccountNumber: null
//   },
//   AdditionalData: null,
//   DetailedInfo: null,
//  Method: 'open-banking',
//   BankId: 'as_tbb_pank_ee',
//   IsSenderBank: false,
//   BankTransactionId: '250630a3-66e7-4957-8535-0d55fbb43adb',
//  Settled: 'Yes',
//   SettlementDate: '2025-03-03T11:30:38.0697614Z'
