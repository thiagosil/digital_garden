import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Echo",
  description: "Reflections on books, movies, shows, and games",
  manifest: "/manifest.json",
  themeColor: "#fcfcfc",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Echo",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
