import Image from 'next/image'

export default function BackgroundImage() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/nasa.webp"
        alt="背景"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={75}
      />
    </div>
  )
} 