import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { s3 } from "@/lib/s3";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_FOLDERS = ["products", "gallery"] as const;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
]);

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !/^[a-z0-9]+$/.test(extension)) {
    return null;
  }

  return extension;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const folderValue = formData.get("folder");

    // Make sure folder is actually a string
    if (typeof folderValue !== "string") {
      return Response.json(
        { error: "Upload folder is required." },
        { status: 400 }
      );
    }

    // Remove accidental whitespace
    const folder = folderValue.trim();

    if (
      !ALLOWED_FOLDERS.includes(
        folder as (typeof ALLOWED_FOLDERS)[number]
      )
    ) {
      return Response.json(
        { error: `Invalid upload folder: ${folder}` },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return Response.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return Response.json(
        { error: "File cannot be empty." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file);

    if (!extension) {
      return Response.json(
        { error: "Invalid file extension." },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

    if (!isImage && !isVideo) {
      return Response.json(
        {
          error:
            "Unsupported file type. Allowed images: JPG, PNG, WEBP. Allowed videos: MP4, WEBM.",
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return Response.json(
        { error: "Image must be smaller than 5MB." },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return Response.json(
        { error: "Video must be smaller than 50MB." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFileName(file.name);

    if (!sanitizedName) {
      return Response.json(
        { error: "Invalid file name." },
        { status: 400 }
      );
    }

    const uniqueId = crypto.randomUUID();

    const fileName = `${uniqueId}-${sanitizedName}.${extension}`;

    const key = `${folder}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.length,
      })
    );

    return Response.json({
      success: true,
      key,
      mediaType: isImage ? "IMAGE" : "VIDEO",
    });
  } catch (error) {
    console.error("S3 upload error:", error);

    return Response.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}