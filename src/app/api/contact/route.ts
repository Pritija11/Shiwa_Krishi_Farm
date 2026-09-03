import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

// POST /api/contact
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, email, subject, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    try {
      await createNotification({
        title: "New Contact Message",
        message: `${contactMessage.name} sent a new contact message.`,
        type: "CONTACT_MESSAGE",
      });
    } catch (error) {
      console.error("Failed to create contact message notification:", error);
    }

    return NextResponse.json(
      {
        message: "Your message has been sent successfully.",
        data: contactMessage,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save contact message:", error);

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
