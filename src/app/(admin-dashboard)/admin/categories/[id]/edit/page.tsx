import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Categories
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Edit Category
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Update this category&apos;s name, slug, and description.
        </p>
      </div>

      <CategoryForm
        mode="edit"
        categoryId={category.id}
        initialValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
        }}
      />
    </div>
  );
}
