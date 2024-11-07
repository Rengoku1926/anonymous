"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body>
        <Navbar/>
        {children}
      </body>
      
    </html>
  );
}
