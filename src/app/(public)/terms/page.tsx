import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Shiwa Krishi Farm",
  description:
    "Read the Terms and Conditions for using the Shiwa Krishi Farm website, placing enquiries, orders, and requesting milk subscriptions.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#F8F5ED] text-[#1F3A2E]">
      <section className="border-b border-[#1F3A2E]/10 bg-[#2F5D46] px-6 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8D9A8]">
            Legal
          </p>

          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Terms & Conditions
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Please read these terms before using the Shiwa Krishi Farm
            website or submitting an order, enquiry, or subscription request.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <p className="text-sm text-[#1F3A2E]/60">
            Last updated: September 2026
          </p>

          <TermsSection title="1. About Our Website">
            <p>
              The Shiwa Krishi Farm website provides information about our
              farm, products, delivery services, milk subscriptions, and ways
              to contact us.
            </p>
          </TermsSection>

          <TermsSection title="2. Product Information">
            <p>
              We make reasonable efforts to keep product names, descriptions,
              prices, availability, and images accurate. However, product
              availability may change, seasonal products may not always be
              available, and product images may differ slightly from the
              actual products.
            </p>
          </TermsSection>

          <TermsSection title="3. Orders and Enquiries">
            <p>
              Submitting an order or enquiry through the website does not
              automatically mean that your order has been confirmed.
            </p>

            <p>
              We may contact you to confirm product availability, quantity,
              price, delivery location, delivery schedule, and other relevant
              details.
            </p>
          </TermsSection>

          <TermsSection title="4. Milk Subscriptions">
            <p>
              Milk subscriptions are requests for recurring milk delivery.
              Customers are responsible for providing accurate information,
              including their contact details, delivery location, selected
              product, delivery frequency, delivery days, start date, and
              subscription duration.
            </p>

            <p>
              Subscription availability depends on our delivery areas,
              delivery schedules, product availability, and confirmation from
              the farm.
            </p>
          </TermsSection>

          <TermsSection title="5. Delivery">
            <p>
              Delivery availability depends on the areas and schedules
              currently served by Shiwa Krishi Farm.
            </p>

            <p>
              Delivery schedules may change because of product availability,
              weather conditions, holidays, farm operations, transportation
              issues, or other circumstances affecting delivery.
            </p>
          </TermsSection>

          <TermsSection title="6. Prices and Payments">
            <p>
              Prices displayed on the website may change. Where applicable,
              the final price and payment arrangements will be confirmed by
              Shiwa Krishi Farm before an order or subscription is fulfilled.
            </p>
          </TermsSection>

          <TermsSection title="7. Customer Information">
            <p>
              You agree to provide accurate and up-to-date information when
              submitting an enquiry, order, or subscription request.
            </p>

            <p>
              You must not submit false, misleading, abusive, malicious, or
              unlawful information through the website.
            </p>
          </TermsSection>

          <TermsSection title="8. Website Use">
            <p>You agree not to:</p>

            <ul>
              <li>Use the website for unlawful purposes.</li>
              <li>Attempt to gain unauthorized access to the website.</li>
              <li>Interfere with the operation of the website.</li>
              <li>Submit malicious or harmful content.</li>
              <li>Misuse website forms or services.</li>
            </ul>
          </TermsSection>

          <TermsSection title="9. Third-Party Links">
            <p>
              Our website may contain links to third-party services such as
              Google Maps, WhatsApp, and social media platforms. These services
              operate independently and may have their own terms and policies.
            </p>
          </TermsSection>

          <TermsSection title="10. Website Content">
            <p>
              The text, images, branding, design, and other content on this
              website belong to Shiwa Krishi Farm or are used with appropriate
              permission.
            </p>

            <p>
              You may not reproduce, modify, distribute, or commercially use
              our website content without permission.
            </p>
          </TermsSection>

          <TermsSection title="11. Website Availability">
            <p>
              We aim to keep the website available and functioning properly,
              but we cannot guarantee uninterrupted or error-free access at
              all times.
            </p>
          </TermsSection>

          <TermsSection title="12. Changes to These Terms">
            <p>
              We may update these Terms & Conditions from time to time.
              Changes will be published on this page with a revised “Last
              updated” date.
            </p>
          </TermsSection>

          <TermsSection title="13. Contact Us">
            <p>
              If you have questions about these Terms & Conditions, please
              contact Shiwa Krishi Farm through the contact details provided
              on our website.
            </p>

            
          </TermsSection>
        </div>
      </section>
    </main>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#1F3A2E]/10 pb-8 last:border-0">
      <h2 className="font-serif text-2xl text-[#2F5D46] md:text-3xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#1F3A2E]/75">
        {children}
      </div>
    </section>
  );
}