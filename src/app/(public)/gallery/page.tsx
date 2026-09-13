import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getS3Url } from "@/lib/s3-url";
import Reveal from "@/components/ui/Reveal";

export default async function GalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const itemsWithUrls = await Promise.all(
    galleryItems.map(async (item) => ({
      ...item,
      mediaUrl: await getS3Url(item.mediaUrl),
    }))
  );

  return (
    <main className="bg-[#F8F5ED]">
      {/* Hero */}
      <section className="px-6 pb-10 pt-28 md:pb-12 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            Farm Gallery
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-dm-serif)] text-4xl leading-tight text-green-950 sm:text-5xl md:text-6xl">
            A glimpse of
            <span className="block text-green-800">
              life on our farm.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            From the animals we raise to the produce we grow, take a
            closer look at the everyday life behind Shiwa Krishi Farm.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-800">
              Behind the scenes
            </p>

            <h2 className="mt-3 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl md:text-5xl">
              Life at Shiwa Krishi Farm
            </h2>
          </Reveal>

          <Reveal>
          {itemsWithUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {itemsWithUrls.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-[1.75rem]"
                >
                  <div className="relative aspect-[4/3] bg-stone-100">
                    {item.mediaType === "IMAGE" ? (
                      <>
                        <Image
                          src={item.mediaUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6">
                          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/70 sm:text-[10px] sm:tracking-[0.2em]">
                            {formatCategory(item.category)}
                          </p>

                          <h3 className="mt-1 font-[family-name:var(--font-dm-serif)] text-base text-white sm:text-2xl">
                            {item.title}
                          </h3>

                          {item.description && (
                            <p className="mt-1 hidden line-clamp-2 text-xs leading-5 text-white/70 sm:mt-2 sm:block">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <video
                        src={item.mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Video information */}
                  {item.mediaType === "VIDEO" && (
                    <div className="bg-white p-3 sm:p-5">
                      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-green-800 sm:text-[10px] sm:tracking-[0.2em]">
                        {formatCategory(item.category)}
                      </p>

                      <h3 className="mt-1 font-[family-name:var(--font-dm-serif)] text-base text-green-950 sm:text-2xl">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-1 hidden text-xs leading-5 text-stone-500 sm:mt-2 sm:block">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-stone-200 bg-[#F8F5ED] px-6 py-20 text-center">
              <p className="font-[family-name:var(--font-dm-serif)] text-2xl text-green-950">
                Our gallery is coming soon.
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500">
                We&apos;re capturing more moments from life at Shiwa
                Krishi Farm. Check back soon.
              </p>
            </div>
          )}
          </Reveal>
        </div>
      </section>

      {/* Farm Stories */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="rounded-[2rem] bg-green-950 px-6 py-12 text-center sm:px-12 md:py-16">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#DDE8D8]">
              Farm Stories
            </p>

            <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-3xl text-white sm:text-4xl md:text-5xl">
              More than just a farm.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Follow the everyday moments at Shiwa Krishi Farm —
              from caring for our animals to growing fresh produce
              for our community.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E7E3D8] px-6 py-16 text-center md:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-green-800">
            From our farm to your table
          </p>

          <h2 className="mt-4 font-[family-name:var(--font-dm-serif)] text-3xl text-green-950 sm:text-4xl md:text-5xl">
            Want to try our farm-fresh products?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-600">
            Browse what&apos;s currently available or get in touch with
            us directly.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-block rounded-full bg-green-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-green-800"
          >
            Explore Products
          </Link>
        </Reveal>
      </section>
    </main>
  );
}

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}