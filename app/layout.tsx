import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner";
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
          <TooltipProvider>
            <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#ffffffff",
                color: "rgb(0, 0, 0)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              },
            }}
          />
            {children}
            </TooltipProvider>
            </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  )
}
