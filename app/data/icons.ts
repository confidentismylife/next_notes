export const groupIcons = [
  {
    color_1: '#61DAFB',
    color_2: '#FF9500',
    img_1: '/icons/dianying.webp',
    img_2: '/icons/swift.webp',
    title_1: 'React',
    title_2: 'Swift'
  },  
  {
    color_1: '#41B883',
    color_2: '#F7DF1E',
    img_1: '/icons/ai.webp',
    img_2: '/icons/js.webp',
    title_1: 'js',
    title_2: 'JavaScript'
  },
  {
    color_1: '#E44D26',
    color_2: '#264DE4',
    img_1: '/icons/html5.webp',
    img_2: '/icons/css3.webp',
    title_1: 'HTML5',
    title_2: 'CSS3'
  },
  {
    color_1: '#007ACC',
    color_2: '#181717',
    img_1: '/icons/xi.webp',
    img_2: '/icons/git.webp',
    title_1: 'VSCode',
    title_2: 'GitHub'
  },
  {
    color_1: '#61DAFB',
    color_2: '#FF9500',
    img_1: '/icons/docker.webp',
    img_2: '/icons/swift.webp',
    title_1: 'Docker',
    title_2: 'Swift'
  },
  {
    color_1: '#61DAFB',
    color_2: '#FF9500',
    img_1: '/icons/ps.webp',
    img_2: '/icons/swift.webp',
    title_1: 'PS',
    title_2: 'Swift'
  }
] as const

export type GroupIcon = typeof groupIcons[number] 