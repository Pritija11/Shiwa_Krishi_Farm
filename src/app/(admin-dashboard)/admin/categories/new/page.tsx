import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
          Categories
        </p>

        <h1 className="mt-2 font-[family-name:var(--font-dm-serif)] text-4xl text-green-950 sm:text-5xl">
          Add Category
        </h1>

        <p className="mt-3 text-sm text-stone-600">
          Create a category to organize your farm products.
        </p>
      </div>

      <CategoryForm mode="create" />
    </div>
  );
}
