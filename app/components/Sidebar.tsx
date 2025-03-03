'use client';

import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  // 模拟数据，实际应用中这些数据应该从API获取
  const popularPosts = [
    { id: 1, title: '如何使用Next.js构建个人博客', views: 1234 },
    { id: 2, title: 'React Hooks完全指南', views: 986 },
    { id: 3, title: 'TypeScript入门教程', views: 756 },
  ];

  const tags = [
    { name: 'React', count: 12 },
    { name: 'Next.js', count: 8 },
    { name: 'TypeScript', count: 6 },
    { name: 'JavaScript', count: 15 },
    { name: 'CSS', count: 10 },
  ];

  return (
    <aside className="w-full md:w-64 space-y-8">
      {/* 个人信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src="/walker.jpg"
              alt="头像"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">博主昵称</h2>
          <p className="text-gray-600 text-sm text-center mb-4">
            前端开发工程师，热爱技术分享
          </p>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="font-bold">123</div>
              <div className="text-sm text-gray-600">文章</div>
            </div>
            <div className="text-center">
              <div className="font-bold">1.2k</div>
              <div className="text-sm text-gray-600">访问</div>
            </div>
          </div>
        </div>
      </div>

      {/* 热门文章 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">热门文章</h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block group"
            >
              <div className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                {post.title}
              </div>
              <div className="text-xs text-gray-500">{post.views} 次阅读</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 标签云 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">标签云</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name.toLowerCase()}`}
              className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 