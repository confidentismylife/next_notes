'use client';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const navItems = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文章' },
    { href: '/categories', label: '分类' },
    { href: '/tags', label: '标签' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="header-overlay">
        <nav className="py-4">
          <div className="flex justify-between items-center px-8">
            <Link href="/" className="text-xl font-bold text-white">
              个人博客
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;