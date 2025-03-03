'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // 只要有滚动就隐藏按钮
      setIsVisible(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    const scrollHeight = window.innerHeight;
    const currentScroll = window.scrollY;
    const targetScroll = currentScroll + scrollHeight;
    
    const maxScroll = document.documentElement.scrollHeight - scrollHeight;
    const finalScroll = Math.min(targetScroll, maxScroll);
    console.log(finalScroll);
    window.scrollTo({
      top: finalScroll,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleScrollClick}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform duration-200 z-50"
    >
      <Image 
        src="/huojian.png" 
        alt="滚动" 
        width={40} 
        height={40}
        className="animate-bounce"
      />
    </button>
  );
};

export default ScrollButton; 