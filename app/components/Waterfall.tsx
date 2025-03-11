import { useEffect, useRef, useState } from 'react'
import type { Post } from './type'
import Image from 'next/image'
import Link from 'next/link'

interface WaterfallProps {
    posts: Post[]
    isLoading?: boolean
}

interface Column {
    height: number
    posts: Post[]
}

// 分类标签的颜色映射
const categoryColors: Record<string, string> = {
    '知识': 'bg-blue-100 text-blue-700',
    '组件库': 'bg-purple-100 text-purple-700',
    '杂谈': 'bg-yellow-100 text-yellow-700',
    '全部': 'bg-gray-100 text-gray-700'
};

export default function Waterfall({ posts, isLoading = false }: WaterfallProps) {
    // 根据屏幕宽度设置不同的列数
    const getInitialColumns = () => {
        if (typeof window === 'undefined') return Array(4).fill({ height: 0, posts: [] })
        const width = window.innerWidth
        const columnCount = width < 640 ? 1 : width < 1024 ? 2 : 4
        return Array(columnCount).fill({ height: 0, posts: [] }).map(() => ({ height: 0, posts: [] }))
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

    // 找到高度最小的列
    const findShortestColumn = (columns: Column[]) => {
        return columns.reduce((shortest, current, index) => {
            return current.height < columns[shortest].height ? index : shortest
        }, 0)
    }

    // 重新分配文章到不同列
    const redistributePosts = () => {
        const newColumns = getInitialColumns()

        posts.forEach((post) => {
            const cardHeight = estimateCardHeight(post)
            const shortestColumnIndex = findShortestColumn(newColumns)
            newColumns[shortestColumnIndex].posts.push(post)
            newColumns[shortestColumnIndex].height += cardHeight
        })

        setColumns(newColumns)
    }

    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            redistributePosts()
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [posts, redistributePosts])

    useEffect(() => {
        redistributePosts()
    }, [posts, redistributePosts])

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
                                                    <span className={`text-[8px] px-2 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                                                        {post.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="p-2">
                                        <h2 className="text-xs font-bold mb-1 line-clamp-2 hover:text-blue-500 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 text-[10px] line-clamp-2 mb-2">
                                            {post.content.replace(/#.*?\n/, '').trim()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Image
                                                    src={'/dog.jpg'}
                                                    alt={post.author}
                                                    width={14}
                                                    height={14}
                                                    className="rounded-full"
                                                />
                                                <span className="text-[10px] text-gray-500 truncate ">我只想说无所谓</span>
                                            </div>
                                            {/* 显示文章分类（如果没有封面图，或显示在底部的备选位置） */}
                                            {!post.coverImage && post.category && (
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                                                    {post.category}
                                                </span>
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