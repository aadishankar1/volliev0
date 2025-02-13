import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vollie",
  description: "Connect volunteers with organizations",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </AuthProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import TanStackProvider from "@/providers/TanstackProviders";
