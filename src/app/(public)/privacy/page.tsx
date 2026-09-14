import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Shiwa Krishi Farm and learn how we collect, use, and protect customer information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#F8F5ED] text-[#1F3A2E]">
      <section className="border-b border-[#1F3A2E]/10 bg-[#2F5D46] px-6 py-20 text-white md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#E8D9A8]">
            Legal
          </p>

          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Your privacy matters to us. This policy explains how Shiwa Krishi
            Farm handles information shared through our website.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl space-y-10">
          <p className="text-sm text-[#1F3A2E]/60">
            Last updated: September 2026
          </p>

          <PolicySection title="1. Information We Collect">
            <p>
              When you contact us, submit an enquiry, place an order request,
              or request a milk subscription, we may collect information such
              as your name, phone number, email address, delivery location,
              product details, delivery preferences, and messages you provide.
            </p>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <p>We may use the information you provide to:</p>

            <ul>
              <li>Respond to product enquiries and customer requests.</li>
              <li>Process and manage orders or delivery requests.</li>
              <li>Arrange milk subscriptions and deliveries.</li>
              <li>Contact you about your enquiry or subscription.</li>
              <li>Provide customer support.</li>
              <li>Improve our products, services, and website.</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. WhatsApp Communication">
            <p>
              Our website may provide WhatsApp links to make it easier for you
              to contact us. When you choose to use WhatsApp, your
              communication is handled through WhatsApp and is also subject to
              WhatsApp&apos;s own terms and privacy policies.
            </p>

            <p>
              Our website does not automatically send WhatsApp messages on
              your behalf. You choose whether to open WhatsApp and send the
              prepared message.
            </p>
          </PolicySection>

          <PolicySection title="4. Sharing of Information">
            <p>
              We do not sell or rent your personal information. We may share
              information when reasonably necessary to fulfil an order,
              arrange delivery, respond to your request, operate essential
              website services, or comply with applicable legal requirements.
            </p>
          </PolicySection>

          <PolicySection title="5. Data Security">
            <p>
              We take reasonable measures to protect information submitted
              through our website from unauthorized access, misuse, alteration,
              or disclosure. However, no method of transmitting information
              over the internet can be guaranteed to be completely secure.
            </p>
          </PolicySection>

          <PolicySection title="6. Cookies and Analytics">
            <p>
              Our website may use cookies or similar technologies that are
              necessary for website functionality. If analytics services are
              enabled, they may collect information about how visitors use the
              website.
            </p>
          </PolicySection>

          <PolicySection title="7. Third-Party Services">
            <p>
              Our website may contain links or integrations with third-party
              services such as Google Maps, WhatsApp, and social media
              platforms. These services have their own privacy policies and
              terms.
            </p>
          </PolicySection>

          <PolicySection title="8. Your Information">
            <p>
              If you have questions about information you have submitted
              through our website, you can contact Shiwa Krishi Farm using the
              contact details provided on our website.
            </p>
          </PolicySection>

          <PolicySection title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our website, services, or applicable requirements.
              Updates will be published on this page with a revised date.
            </p>
          </PolicySection>

          <PolicySection title="10. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact
              Shiwa Krishi Farm through the contact details provided on our
              website.
            </p>

            
          </PolicySection>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
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