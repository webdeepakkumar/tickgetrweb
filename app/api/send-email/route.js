import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap";
import QRCode from "qrcode";

async function generateQRCodeImage(tQrCode) {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(tQrCode, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

async function generateQRCodeURL(tQrCode) {
  return new Promise((resolve, reject) => {
    QRCode.toString(tQrCode, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

const TOKEN = process.env.NEXT_PUBLIC_MAILTRAP_TOKEN;
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export async function POST(req) {
  try {
    const {
      qType,
      to,
      tQrCode,
      bName,
      tQuantity,
      tType,
      tUID,
      eventName,
      cCompany,
      cComment,
      cPhone,
      cEmail,
      cName,
      cType,
      uEmail,
      uName,
      rAmount,
      rDate,
      cardDigits,
      rAdjustment,
      refundAmount,
      eStart,
      location,
      eDescription,
      paymentMethod,
      amountPaid,
    } = await req.json();

    let emailOptions = {
      to: [{ email: to }],
      from: {
        email: "mailtrap@tickgetr.be",
        name: "Tickgetr",
      },
      template_uuid: tUID,
      template_variables: {
        bName,
        qType,
        tType,
        tQuantity,
        eventName,
        attachment: !!tQrCode,
        cPhone,
        cComment,
        cCompany,
        cName,
        cType,
        cEmail,
        uEmail,
        uName,
        rAmount,
        rDate,
        cardDigits,
        rAdjustment,
        refundAmount,
        eStart,
        location,
        eDescription,
        paymentMethod,
        amountPaid,
      },
    };

    if (tQrCode) {
      const qrCodeImageBuffer = await generateQRCodeImage(tQrCode);
      const qrCodeURL = await generateQRCodeURL(tQrCode);
      emailOptions.template_variables.qrCodeURL = qrCodeURL;
    }

    await client.send(emailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Failed to handle request" },
      { status: 500 }
    );
  }
}
