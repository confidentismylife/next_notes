'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文章' },
    { href: '/categories', label: '分类' },
    { href: '/tags', label: '标签' },
  ];

  // 格式化构建时间
  const formattedBuildTime = useMemo(() => {
    const buildTime = new Date(process.env.BUILD_TIME || '');
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - buildTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}天前`;
    
    return buildTime.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="header-overlay">
        <nav className="py-4">
          <div className="flex justify-between items-center px-8">
            <Link href="/" className="text-xl font-bold text-white">
              个人博客
            </Link>

            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                分类
              </Link>
              <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                 gitHub
              </Link>
              {/* 头像和个人介绍 */}
              <div 
                className="relative"
                onMouseEnter={() => setShowProfile(true)}
                onMouseLeave={() => setShowProfile(false)}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-white/50 transition-all">
                  <Image
                    src="/dog.jpg"
                    alt="头像"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 个人介绍卡片 */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 transition-opacity duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative">
                        <Image
                          src="/dog.jpg"
                          alt="头像"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">我只相说无所谓</h3>
                        <p className="text-sm text-gray-600">前端菜鸟实习生</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      热爱分享，学习前端开发和用户体验设计
                    </p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-bold">123</div>
                        <div>文章</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">1.2k</div>
                        <div>访问</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{formattedBuildTime}</div>
                        <div>最近更新</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;