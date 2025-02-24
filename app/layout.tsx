import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import TanStackProvider from "@/providers/TanstackProviders";

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
        <ErrorBoundary>
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
                <ToastContainer />
              </AuthProvider>
            </TanStackProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
