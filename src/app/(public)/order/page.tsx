import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderForm from "@/components/order/OrderForm";

type OrderPageProps = {
  searchParams: Promise<{
    product?: string;
  }>;
};

export default async function OrderPage({
  searchParams,
}: OrderPageProps) {
  const { product } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="bg-[#F8F5ED] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            Order / Enquiry
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-5xl leading-tight text-green-950 sm:text-6xl">
            Tell us what you&apos;re looking for.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600">
            Fill out the form below and we&apos;ll get back to you with
            availability, pricing, and delivery details.
          </p>
        </div>

        {/* Form */}
        <OrderForm
          products={products}
          selectedProduct={product}
        />

        {/* WhatsApp / Phone */}
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500">
            Prefer to contact us directly?
          </p>

          <div className="mt-3 flex justify-center gap-3">
            <Link
              href="#"
              className="rounded-full border border-green-900/20 px-5 py-2.5 text-sm font-medium text-green-900 transition hover:bg-green-900/5"
            >
              WhatsApp
            </Link>

            <Link
              href="tel:+9770000000000"
              className="rounded-full border border-green-900/20 px-5 py-2.5 text-sm font-medium text-green-900 transition hover:bg-green-900/5"
            >
              Call Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}