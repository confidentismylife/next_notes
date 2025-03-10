import type { Metadata, Viewport } from "next";
import Header from "../components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人博客",
  description: "基于 Next.js 构建的个人博客",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
