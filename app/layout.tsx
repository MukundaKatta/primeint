import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrimeInt — Nail your next interview.",
  description:
    "AI-powered mock interviews that feel real. Role-specific questions. Feedback that actually helps you improve.",
  openGraph: {
    title: "PrimeInt — Nail your next interview.",
    description:
      "AI-powered mock interviews that feel real. Role-specific questions. Feedback that actually helps you improve.",
    images: [
      {
        url: "https://waitlist-api-sigma.vercel.app/api/og?title=PrimeInt&accent=amber&category=Career",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://waitlist-api-sigma.vercel.app/api/og?title=PrimeInt&accent=amber&category=Career",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
