"use client"

import { Quicksand } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import { ChatBot } from "@/components/chat-bot";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={quicksand.variable}>
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

