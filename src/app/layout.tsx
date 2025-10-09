/** @format */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Identifikasi Suara Burung",
  description: "Dibuat oleh Fredy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`font-quicksand`}>{children}</body>
    </html>
  );
}
