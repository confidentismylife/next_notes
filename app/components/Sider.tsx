import { useMemo, useState } from 'react'
import type { Post } from './type'
import { CATEGORIES } from './type'
import Link from 'next/link'

interface SiderProps {
    posts: Post[]
    activeDate?: string
    onDateSelect?: (date: string) => void
    activeCategory?: string
    onCategoryChange?: (category: string) => void
}

interface DateGroup {
    [key: string]: {
        [key: string]: Post[]
    }
}

export default function Sider({ posts, activeDate, onDateSelect, activeCategory = CATEGORIES.ALL, onCategoryChange }: SiderProps) {
    // 不再需要本地状态，使用父组件传入的activeCategory
    
    // 按分类筛选文章
    const filteredPosts = useMemo(() => {
        if (activeCategory === CATEGORIES.ALL) {
            return posts;
        }
        return posts.filter(post => post.category === activeCategory);
    }, [posts, activeCategory]);
    
    // 按年月对文章进行分组
    const groupedPosts = useMemo(() => {
        const groups: DateGroup = {}
        
        filteredPosts.forEach(post => {
            const date = new Date(post.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            
            if (!groups[year]) {
                groups[year] = {}
            }
            if (!groups[year][month]) {
                groups[year][month] = []
            }
            
            groups[year][month].push(post)
        })
        
        return groups
    }, [filteredPosts])

    // 获取所有年份并排序
    const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a))

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden w-52 ml-8">
            {/* 分类选项 */}
            <div className="p-3 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 mb-2">文章分类</h2>
                <div className="space-y-1">
                    {Object.values(CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange?.(category)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors
                                ${activeCategory === category
                                    ? 'bg-blue-50 text-blue-500 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* 时间轴标题 */}
            <div className="p-3 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">文章时间轴</h2>
            </div>

            {/* 可滚动的内容区域 */}
            <div className="flex-1 overflow-y-auto" style={{ overflowX: 'hidden' }}>
                {years.length > 0 ? (
                    <div className="p-3 space-y-4">
                        {years.map(year => (
                            <div key={year} className="space-y-2">
                                <div className="text-xs font-medium text-gray-900 flex items-center gap-2">
                                    <span>{year}年</span>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </div>
                                <div className="space-y-0.5">
                                    {Object.keys(groupedPosts[year])
                                        .sort((a, b) => Number(b) - Number(a))
                                        .map(month => {
                                            const dateKey = `${year}-${month}`
                                            const isActive = activeDate === dateKey
                                            const postsCount = groupedPosts[year][month].length
                                            
                                            return (
                                                <button
                                                    key={month}
                                                    onClick={() => onDateSelect?.(dateKey)}
                                                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors
                                                        ${isActive 
                                                            ? 'bg-blue-50 text-blue-500 font-medium' 
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{month}月</span>
                                                        <span className={`text-[10px] ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                                                            {postsCount}篇
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        暂无文章数据
                    </div>
                )}
            </div>
        </div>
    )
} 