import { useEffect, useRef, useState } from "react"
import type { Post } from "./type"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"

  
interface WaterfallProps {
	posts: Post[]
	isLoading?: boolean
}

interface Column {
	height: number
	posts: Post[]
}

// 添加新的类型定义
interface PostWithHeight {
	post: Post
	height: number
}

// 分类标签的颜色映射
const categoryColors: Record<string, string> = {
	知识: "bg-blue-100 text-blue-700",
	组件库: "bg-purple-100 text-purple-700",
	杂谈: "bg-yellow-100 text-yellow-700",
	全部: "bg-gray-100 text-gray-700",
}

export default function Waterfall({ posts, isLoading = false }: WaterfallProps) {
	// 根据屏幕宽度设置不同的列数
	const getInitialColumns = () => {
		if (typeof window === "undefined") return Array(4).fill({ height: 0, posts: [] })
		const width = window.innerWidth
		const columnCount = width < 640 ? 1 : width < 1024 ? 2 : 4
		return Array.from({ length: columnCount }, () => ({
			height: 0,
			posts: [],
		}))
	}

	const [columns, setColumns] = useState<Column[]>(getInitialColumns())
	const containerRef = useRef<HTMLDivElement>(null)

	// 根据内容估算卡片高度
	const estimateCardHeight = (post: Post) => {
		let height = 0
		// 封面图固定高度
		if (post.coverImage) {
			height += Math.floor(Math.random() * 100) + 250 // 250-350px 随机高度
		}
		// 标题、作者信息等基础高度
		height += 100
		// 根据内容长度增加高度
		height += Math.ceil(post.content.length / 200) * 20
		return height
	}
	// 修改后的分配算法（最佳适应下降策略）
	const findOptimalDistribution = (posts: PostWithHeight[], columnCount: number) => {
		// 1. 按文章高度降序排序
		const sortedPosts = [...posts].sort((a, b) => b.height - a.height)
		
		// 2. 初始化各列
		const columns: PostWithHeight[][] = Array.from(
			{ length: columnCount }, 
			() => []
		)
		const columnHeights: number[] = Array(columnCount).fill(0)

		// 3. 遍历排序后的文章
		for (const post of sortedPosts) {
			// 寻找当前最适合的列（放入后总高度最小的列）
			let minHeight = Infinity
			let targetColumn = 0
			
			for (let i = 0; i < columnCount; i++) {
				const potentialHeight = columnHeights[i] + post.height
				if (potentialHeight < minHeight) {
					minHeight = potentialHeight
					targetColumn = i
				}
			}
			
			// 将文章放入目标列
			columns[targetColumn].push(post)
			columnHeights[targetColumn] = minHeight
		}

		return columns
	}
	// 修改后的redistributePosts函数
	const redistributePosts = () => {
		const newColumns = getInitialColumns()
		const columnCount = newColumns.length

		// 计算所有文章高度
		const postHeights: PostWithHeight[] = posts.map(post => ({
			post,
			height: estimateCardHeight(post)
		}))

		// 使用改进贪心算法
		const optimalDistribution = findOptimalDistribution(postHeights, columnCount) 

		// 更新列数据
		optimalDistribution.forEach((columnPosts, index) => {
			newColumns[index].posts = columnPosts.map(p => p.post)
			newColumns[index].height = columnPosts.reduce((sum, p) => sum + p.height, 0)
		})

		setColumns(newColumns)
	}

	// 监听窗口大小变化
	useEffect(() => {
		const handleResize = () => {
			redistributePosts()
		}
		redistributePosts()
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [posts])

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
			</div>
		)
	}

	return (
		<div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 max-w-[2000px] mx-auto">
			{columns.map((column, columnIndex) => (
				<div key={columnIndex} className="flex flex-col gap-4">
					{column.posts.map((post) => {
						const randomHeight = Math.floor(Math.random() * 120) + 190 // 250-350px
						return (
							<Link key={post.slug} href={`/posts/${post.slug}`}>
								<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] overflow-hidden">
									{post.coverImage && (
										<div className="relative w-full" style={{ height: `${randomHeight}px` }}>
											<Image
												src={post.coverImage}
												alt={post.title}
												fill
												sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
												className="object-cover"
												priority={columnIndex === 0}
											/>
											{post.category && (
												<div className="absolute top-2 right-2">
													<span className={`text-[8px] px-2 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>{post.category}</span>
												</div>
											)}
										</div>
									)}
									<div className="p-2">
										<h2 className="text-xs font-bold mb-1 line-clamp-2 hover:text-blue-500 transition-colors">{post.title}</h2>
										<p className="text-gray-600 text-[10px] line-clamp-2 mb-2">{post.content.replace(/#.*?\n/, "").trim()}</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-1">
												<Image src={"/dog.jpg"} alt="作者头像" width={14} height={14} className="rounded-full" />
												<span className="text-[10px] text-gray-500 truncate ">我只想说无所谓</span>
											</div>
											{/* 显示文章分类（如果没有封面图，或显示在底部的备选位置） */}
											{!post.coverImage && post.category && (
												<span className={`text-[8px] px-2 py-0.5 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>{post.category}</span>
											)}
										</div>
									</div>
								</div>
							</Link>
						)
					})}
					
				</div>
			))}
		</div>
	)
}
