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
  const command = new SendEmailCommand({
    FromEmailAddress: "pritijaghising19@gmail.com",
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