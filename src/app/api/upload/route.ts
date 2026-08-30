import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `products/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return Response.json({
      success: true,
      key: `products/${fileName}`,
    });
  } catch (error) {
    console.error("S3 upload error:", error);

    return Response.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}