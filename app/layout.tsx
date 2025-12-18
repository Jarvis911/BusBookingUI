"use client"

import { Quicksand, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import { ChatBot } from "@/components/chat-bot";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${quicksand.variable} ${bebasNeue.variable}`}>
      <head>
        <title>Duc Tri Bus Lines - Đặt vé xe trực tuyến</title>
        <meta name="description" content="Hệ thống đặt vé xe trực tuyến Duc Tri Bus Lines. Chọn chỗ ngồi yêu thích, thanh toán bảo mật." />
        <link rel="icon" href="/favico.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favico.png" sizes="180x180" />
      </head>
      <body className={quicksand.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
