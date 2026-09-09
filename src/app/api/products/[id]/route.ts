import { NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getS3Url } from "@/lib/s3-url";
import { s3 } from "@/lib/s3";
import { auth } from "@/auth";
import { productSchema } from "@/validations/product";

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const images = await Promise.all(
      product.images.map(async (image) => ({
        key: image.imageUrl,
        url: await getS3Url(image.imageUrl),
      }))
    );

    return NextResponse.json({
      ...product,
      price: product.price.toString(),
      images,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const result = productSchema.safeParse({
      ...body,
      price:
        typeof body.price === "string"
          ? Number(body.price)
          : body.price,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          error: "Validation failed",
          fields: errors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      unit,
      availability,
      images,
      categoryId,
    } = result.data;

    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: {
            categoryId: ["Selected category does not exist"],
          },
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        unit,
        availability,
        categoryId,
        isActive,
        imageUrl: images[0],

        images: {
          deleteMany: {},
          create: images.map((imageUrl, index) => ({
            imageUrl,
            sortOrder: index,
          })),
        },
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    const removedImageKeys = existingProduct.images
      .map((image) => image.imageUrl)
      .filter((key) => !images.includes(key));

    if (removedImageKeys.length > 0) {
      try {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Delete: {
              Objects: removedImageKeys.map((key) => ({
                Key: key,
              })),
            },
          })
        );
      } catch (error) {
        console.error(
          "Failed to delete removed product images from S3:",
          error
        );
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: body.isActive,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product status:", error);

    return NextResponse.json(
      { error: "Failed to update product status" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const activeEnquiryCount = await prisma.enquiry.count({
      where: {
        productId: id,
        status: {
          not: "CANCELLED",
        },
      },
    });

    if (activeEnquiryCount > 0) {
      return NextResponse.json(
        {
          error:
            "This product has active enquiries and can't be deleted. Archive it instead.",
        },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.enquiry.deleteMany({
        where: {
          productId: id,
        },
      }),
      prisma.product.delete({
        where: {
          id,
        },
      }),
    ]);

    if (existingProduct.images.length > 0) {
      try {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Delete: {
              Objects: existingProduct.images.map((image) => ({
                Key: image.imageUrl,
              })),
            },
          })
        );
      } catch (error) {
        console.error(
          "Failed to delete product images from S3:",
          error
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "This product has existing enquiries and can't be deleted. Archive it instead.",
        },
        { status: 409 }
      );
    }

    console.error("Failed to delete product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}