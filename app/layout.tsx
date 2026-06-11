import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glow — Beauty & Skincare",
  description: "Glow Different. Premium vegan skincare for the Gen-Z glow-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
