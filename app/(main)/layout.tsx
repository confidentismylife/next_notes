import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";

// 优化字体加载
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: "个人博客",
  description: "基于 Next.js 构建的个人博客",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
