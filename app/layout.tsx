import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { MainNavClient } from "@/components/mainNav";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FilesDrive",
  description: "Your files, your way",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          data-website-id="673c33d183daa66fe3b794d5"
          data-domain="filesdrive.xyz"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <MainNavClient />
          {children}
        </Providers>
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-2W0T0F0VHE" />
    </html>
  );
}
