import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    await sendEmail(
      "pritijaghising19@gmail.com",
      "Shiwa Krishi SES Test",
      "This email was sent from the Shiwa Krishi Next.js backend."
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SES test failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}