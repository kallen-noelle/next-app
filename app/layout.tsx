import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

import { TooltipProvider } from "@/components/ui/tooltip"
const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <AuthProvider>
        <ThemeProvider> 
          <TooltipProvider>{children}
            </TooltipProvider>
            </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  )
}
