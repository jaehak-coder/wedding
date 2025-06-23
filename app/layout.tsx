import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WeddingPlanProvider } from "./contexts/WeddingPlanContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "현진 ♥ 재학 웨딩 플랜",
  description: "우리의 특별한 날을 위한 완벽한 준비",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <WeddingPlanProvider>{children}</WeddingPlanProvider>
      </body>
    </html>
  )
}
