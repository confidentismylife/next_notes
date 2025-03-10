'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from './type';

interface ArticleCardProps {
  post: Post;
  aspectRatio?: string;
}

export default function ArticleCard({ post, aspectRatio = '4/3' }: ArticleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 如果 post 不存在，返回一个占位卡片
  if (!post) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="relative w-full" style={{ aspectRatio }}>
          <div className="absolute inset-0 bg-gray-200"></div>
        </div>
        <div className="p-2">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-3 bg-gray-200 rounded"></div>
              <div className="w-6 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative w-full" style={{ aspectRatio }}>
          <Image
            src={post.coverImage || '/images/default-cover.jpg'}
            alt={post.title}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
        </div>
        <div className="p-2">
          <h3 className="text-sm font-medium line-clamp-2 mb-1">
            {post.title}
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2 mb-2">
            {post.excerpt || post.content.slice(0, 60)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={post.authorAvatar || '/images/default-avatar.jpg'}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-600">{post.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likes}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 