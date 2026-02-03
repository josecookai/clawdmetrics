import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClawdMetrics Dashboard",
  description: "Metrics dashboard for ClawdMetrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
