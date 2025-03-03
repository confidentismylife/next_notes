'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import ArticleCard from './ArticleCard'
import styles from './SecondScreen.module.css'

// 动态导入 TagsGroupBar
const TagsGroupBar = dynamic(() => import('./TagsGroupBar'), {
  ssr: false,
  loading: () => <TagsGroupBarSkeleton />
})

// 骨架屏组件
function TagsGroupBarSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="space-y-4 w-full p-8">
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

export default function SecondScreen() {
  return (
    <div className={styles.container}>
      <div>
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-[250px]">
            <Suspense fallback={<TagsGroupBarSkeleton />}>
              <TagsGroupBar />
            </Suspense>
          </div>
          <ArticleCard />
        </div>
      </div>
    </div>
  )
} 