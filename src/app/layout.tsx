"use client";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";



// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#27272a]">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
