import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../styles/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../styles/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../styles/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../styles/satoshi/Satoshi-Bold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../styles/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../styles/satoshi/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Klaro",
  description:
    "Mobile-first food scanning, ingredient analysis, and community food discovery platform.",
  icons: {
    icon: "/assets/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E6E4E5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`bg-[#E6E4E5] ${satoshi.variable}`}>
        <body suppressHydrationWarning className="antialiased font-sans text-charcoal-900 bg-[#E6E4E5] selection:bg-[#94EC40] selection:text-[#121212]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
