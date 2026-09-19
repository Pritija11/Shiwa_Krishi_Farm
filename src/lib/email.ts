import {
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({
  region: "ap-south-1",
});

export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  const fromEmail = process.env.SES_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("SES_FROM_EMAIL is not set.");
  }

  const command = new SendEmailCommand({
    FromEmailAddress: fromEmail,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    },
  });

  return ses.send(command);
}