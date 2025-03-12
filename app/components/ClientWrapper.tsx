"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Post } from './type'
import { CATEGORIES } from './type'
import ImportMarkdown from './ImportMarkdown'
import FirstScreenStatic from './FirstScreenStatic'
import Waterfall from './Waterfall'
import { getPosts } from '../actions/posts'
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
	const [activeDate, setActiveDate] = useState<string>('');
	const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES.ALL);
	
	// 添加筛选文章的函数
	const filteredPosts = () => {
		let result = [...posts];
		
		// 按分类筛选
		if (activeCategory !== CATEGORIES.ALL) {
			result = result.filter(post => post.category === activeCategory);
		}
		
		// 按日期筛选（如果有设置activeDate）
		if (activeDate) {
			const [year, month] = activeDate.split('-');
			result = result.filter(post => {
				const date = new Date(post.date);
				return date.getFullYear() === parseInt(year) && 
					(date.getMonth() + 1) === parseInt(month);
			});
		}
		
		return result;
	};

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const data = await getPosts();
				console.log('data', data);
				
				// 确保每个 post 都有必要的字段
				const processedData = data.map((post: any) => {
					// 确保所有必要的字段都存在
					return {
						...post,
					}
				})
				
				setPosts(processedData)
				setIsLoading(false)
			} catch (error) {
				console.error('Failed to fetch posts', error)
				setIsLoading(false)
			}
		}

		fetchPosts();
	}, []);
	
	// 处理分类变更
	const handleCategoryChange = (category: string) => {
		setActiveCategory(category);
		// 切换分类时重置日期筛选
		setActiveDate('');
	};
	
	// 处理日期变更
	const handleDateSelect = (date: string) => {
		setActiveDate(date === activeDate ? '' : date);
	};

	return (
		<>
			<FirstScreenStatic TypedTextComponent={TypedText} ScrollButtonComponent={ScrollButton} />
			<ImportMarkdown />
			<div className="bg-[#f7f9fe] py-12 flex px-8 gap-8">
				<div className="w-48 top-16 h-[calc(100vh-4rem)] flex-shrink-0">
					<Sider 
						posts={posts} 
						activeDate={activeDate} 
						onDateSelect={handleDateSelect} 
						activeCategory={activeCategory}
						onCategoryChange={handleCategoryChange}
					/>
				</div>
				<div className="flex-1">
					<Waterfall posts={filteredPosts()} isLoading={isLoading} />
				</div>
			</div>
			{/* <SecondScreenWrapper /> */}
		</>
	)
}
