import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/validations/category";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PUT /api/categories/[id]
export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, slug, description } = result.data;

    const conflictingCategory = await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [{ name }, { slug }],
      },
    });

    if (conflictingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to update category:", error);

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        {
          error:
            "This category still has products assigned to it. Move or delete those products first.",
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);

    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
