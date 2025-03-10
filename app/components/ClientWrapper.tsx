"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Post } from './type'
import ImportMarkdown from './ImportMarkdown'
import FirstScreenStatic from './FirstScreenStatic'
import Waterfall from './Waterfall'
import { getAllPosts } from '../actions/posts'
import Sider from './Sider'

// 延迟加载组件
const TypedText = dynamic(() => import("./TypedText"), {
	ssr: false,
	loading: () => <span>欢迎来到我的博客🎉</span>,
})

const ScrollButton = dynamic(() => import("./ScrollButton"), {
	ssr: false,
	loading: () => null,
})

const SecondScreenWrapper = dynamic(() => import("./SecondScreenWrapper"), {
	ssr: false,
	loading: () => <div className="min-h-screen bg-[#f7f9fe]" />,
})

export default function ClientWrapper() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const data = await getAllPosts();
				console.log('data', data);
				
				// 确保每个 post 都有必要的字段
				const processedData = data.map(post => {
					// 确保所有必要的字段都存在
					return {
						...post,
						coverImage: post.coverImage || `/images/covers/${post.slug}.jpg`,
						excerpt: post.excerpt || (post.content ? post.content.slice(0, 100) : '暂无摘要'),
						authorAvatar: post.authorAvatar || '/images/default-avatar.jpg'
					};
				});
				
				setPosts(processedData);
				setIsLoading(false);
			} catch (error) {
				console.error('获取文章列表失败:', error);
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, []);

	return (
		<>
			<FirstScreenStatic TypedTextComponent={TypedText} ScrollButtonComponent={ScrollButton} />
			<ImportMarkdown />
			<div className="bg-[#f7f9fe] py-12 flex px-8 gap-8">
				<div className="w-48 top-16 h-[calc(100vh-4rem)] flex-shrink-0">
					<Sider posts={posts} />
				</div>
				<div className="flex-1">
					<Waterfall posts={posts} isLoading={isLoading} />
				</div>
			</div>
			<SecondScreenWrapper />
		</>
	)
}
