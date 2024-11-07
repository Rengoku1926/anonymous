"use client"
import { InputOTPPattern } from "@/components/ui/InputOTP"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body>
      
      {children}
        </body>
    </html>
  )
}
