import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from "@/src/widgets/Header";
import { ThemeProvider } from "@/src/entities/theme";
import { Footer } from "@/src/widgets/Footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verification",
  description: "Don't trust, just verify.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white text-black from-gray-50 to-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-[100vh]">
            <Header />
            <main className="flex justify-center items-center my-auto">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
