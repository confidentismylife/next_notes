'use client'

import { useEffect } from 'react'

export default function PreloadSecondScreen({ 
    children,
    onScroll 
}: { 
    children: React.ReactNode
    onScroll: () => void
}) {
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                onScroll()
                window.removeEventListener('scroll', handleScroll)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [onScroll])

    return <>{children}</>
} 