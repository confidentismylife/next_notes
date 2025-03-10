'use client';

import { useEffect, useState, memo, useCallback } from 'react'
import Image from 'next/image';
import TagsTitle from './TagsTitle';
import { groupIcons, type GroupIcon } from '../data/icons'
import dynamic from 'next/dynamic'

// 使用 memo 优化重复渲染
const TagIcon = memo(function TagIcon({ color, img, title }: { 
    color: string, 
    img: string, 
    title: string 
}) {
    return (
        <div
            style={{ background: color }}
            className='tags-group-icon w-20 h-20 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md hover:scale-110 transition-transform duration-300'
        >
            <Image
                src={img}
                alt={title}
                width={48}
                height={48}
                className='w-[90%]'
                loading="lazy"
            />
        </div>
    )
})

// 优化图标对组件
export const IconPair = memo(function IconPair({ 
    icon, 
    groupIndex, 
    index 
}: { 
    icon: GroupIcon
    groupIndex: number
    index: number 
}) {
    return (
        <div key={`${groupIndex}-${index}`} className='tags-group-icon-pair ml-4 select-none'>
            <TagIcon color={icon.color_1} img={icon.img_1} title={icon.title_1} />
            <div className="mt-4">
                <TagIcon color={icon.color_2} img={icon.img_2} title={icon.title_2} />
            </div>
        </div>
    )
})

// 图标组件
const TagsIcons = dynamic(() => import('./TagsIcons'), {
    ssr: false,
    loading: () => <div className="animate-pulse h-56 bg-gray-200 rounded-xl" />
})

export default memo(function TagsGroupBar() {
    return (
        <div className="mt-32 tags-group-all flex -rotate-[20deg] h-56 w-[900px] relative">
            <TagsTitle />
            <TagsIcons />
        </div>
    )
}) 