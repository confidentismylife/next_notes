'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Post } from './type'; 
import ArticleCard from './ArticleCard';

interface MasonryGridProps {
  posts: Post[];
  columns?: number;
}

export default function MasonryGrid({ posts = [], columns = 4 }: MasonryGridProps) {
  const [currentColumns, setCurrentColumns] = useState(columns);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  
  // 响应式列数
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentColumns(2);
      } else if (width < 768) {
        setCurrentColumns(3);
      } else if (width < 1024) {
        setCurrentColumns(4);
      } else {
        setCurrentColumns(columns);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  // 初始化列高度数组
  useEffect(() => {
    setColumnHeights(new Array(currentColumns).fill(0));
    columnsRef.current = new Array(currentColumns);
  }, [currentColumns]);

  // 确保 posts 是一个数组
  const validPosts = Array.isArray(posts) ? posts : [];

  // 随机生成不同的图片比例
  const getRandomAspectRatio = () => {
    const ratios = ['3/4', '4/3', '1/1', '16/9', '2/3'];
    return ratios[Math.floor(Math.random() * ratios.length)];
  };

  // 为每篇文章分配随机的图片比例
  const postsWithAspectRatio = validPosts.map(post => ({
    ...post,
    aspectRatio: getRandomAspectRatio()
  }));

  // 如果没有文章，显示加载状态
  if (validPosts.length === 0) {
    return (
      <div className="w-full px-2">
        <div className="flex flex-wrap -mx-1">
          {Array.from({ length: currentColumns * 2 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="px-1 mb-2" style={{ width: `${100 / currentColumns}%` }}>
              <ArticleCard 
                post={undefined as any} 
                aspectRatio={getRandomAspectRatio()}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <div className="flex flex-wrap -mx-1">
        {postsWithAspectRatio.map((post, index) => (
          <div 
            key={`post-${post.slug || index}`} 
            className="px-1 mb-2" 
            style={{ width: `${100 / currentColumns}%` }}
          >
            <ArticleCard 
              post={post} 
              aspectRatio={post.aspectRatio}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 