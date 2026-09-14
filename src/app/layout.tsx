import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Shiwa Krishi Farm",
    template: "%s | Shiwa Krishi Farm",
  },
  description:
    "Fresh farm products including poultry, goat meat, fresh cow milk, and organic vegetables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {gaMeasurementId && (
          <GoogleAnalytics measurementId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}