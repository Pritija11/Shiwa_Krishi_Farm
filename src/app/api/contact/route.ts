import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { contactSchema } from "@/validations/contact";

// POST /api/contact
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          error: "Validation failed",
          fields: errors,
        },
        { status: 400 },
      );
    }

    const { name, phone, email, subject, message } = result.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone: phone ?? null,
        email: email ?? null,
        subject: subject ?? null,
        message,
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
