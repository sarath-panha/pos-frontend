import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SME App",
  description: "Simple business management for SMEs",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-surface text-on-surface`}>
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="pb-[calc(72px+env(safe-area-inset-bottom))]">
              {children}
            </main>
            <Navigation />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
