'use client'

import dynamic from 'next/dynamic'
import FirstScreenStatic from './FirstScreenStatic'

// 延迟加载第二屏相关组件
const SecondScreenWrapper = dynamic(() => import('../components/SecondScreenWrapper'), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#f7f9fe]" />
})

// 只加载首屏需要的交互组件
const TypedText = dynamic(() => import('./TypedText'), { 
    ssr: false,
    loading: () => <span>欢迎来到我的博客🎉</span>
})

const ScrollButton = dynamic(() => import('./ScrollButton'), {
    ssr: false,
    loading: () => null
})

export default function ClientWrapper() {
    return (
        <>
            <FirstScreenStatic 
                TypedTextComponent={TypedText}
                ScrollButtonComponent={ScrollButton}
            />
            <SecondScreenWrapper />
        </>
    )
} 