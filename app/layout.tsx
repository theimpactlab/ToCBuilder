import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ColorThemeProvider } from "@/lib/color-theme-context"
import { PointerEventsFix } from "@/components/pointer-events-fix"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Theory of Change Builder",
  description: "Build and customize your organization's theory of change with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ColorThemeProvider>
            <PointerEventsFix />
            {children}
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
