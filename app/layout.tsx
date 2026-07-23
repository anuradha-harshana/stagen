import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const manropeHeading = Manrope({subsets:['latin'],variable:'--font-heading'});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STAGEN",
  description: "You see what we build!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", poppins.variable, manropeHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Toaster/>
        <main>{children}</main>
      </body>
    </html>
  );
}
