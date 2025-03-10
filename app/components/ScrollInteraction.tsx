'use client'

import { useState, useEffect } from 'react'

export default function ScrollInteraction({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  const handleScrollClick = () => {
    const scrollHeight = window.innerHeight
    const currentScroll = window.scrollY
    const targetScroll = currentScroll + scrollHeight
    
    const maxScroll = document.documentElement.scrollHeight - scrollHeight
    const finalScroll = Math.min(targetScroll, maxScroll)
    
    window.scrollTo({
      top: finalScroll,
      behavior: 'smooth'
    })
  }

  return (
    <div onClick={handleScrollClick}>
      {children}
    </div>
  )
} 