import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "./components/Navbar"
import { Footer } from "./components/Footer"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { redirect } from "next/navigation"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Volunteen",
  description: "Connect volunteers with organizations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
            <ToastContainer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

