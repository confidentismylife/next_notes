"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function PenguinAnimation() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isLoaded, setIsLoaded] = useState({
    frame1: false,
    frame2: false
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => prev === 1 ? 2 : 1)
    }, 800) // 减慢切换频率到800毫秒

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-[150px] h-[150px] overflow-hidden">
      {/* 预加载两个图像，使用绝对定位叠放，通过透明度控制显示 */}
      <div className="absolute inset-0 transition-opacity duration-300" 
           style={{ opacity: currentFrame === 1 ? 1 : 0 }}>
        <Image 
          src="/01企鹅-第一帧-copy.svg"
          alt="企鹅动画第一帧"
          width={150}
          height={150}
          priority
          onLoad={() => setIsLoaded(prev => ({ ...prev, frame1: true }))}
        />
      </div>
      
      <div className="absolute inset-0 transition-opacity duration-300" 
           style={{ opacity: currentFrame === 2 ? 1 : 0 }}>
        <Image 
          src="/01企鹅-第二帧-copy.svg"
          alt="企鹅动画第二帧"
          width={150}
          height={150}
          priority
          onLoad={() => setIsLoaded(prev => ({ ...prev, frame2: true }))}
        />
      </div>
    </div>
  )
} 