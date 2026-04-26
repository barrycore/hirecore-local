import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/shared/navbar";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireCore Local - Find Local Work",
  description:
    "A controlled workforce marketplace connecting skilled workers with local opportunities.",
  keywords: ["jobs", "local work", "workforce", "marketplace", "hire"],
  openGraph: {
    title: "HireCore Local",
    description: "Find verified local work opportunities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary-foreground">
        <ThemeProvider>
        <Navbar />

        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>

        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}