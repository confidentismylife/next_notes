import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "个人博客",
  description: "基于 Next.js 构建的个人博客",
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
