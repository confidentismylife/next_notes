import Image from "next/image"

export default function ArticleCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-[2/1] relative">
        <Image src="/walker.jpg" alt="NotionNext4.0" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div className="text-white">
            <div className="text-sm mb-2">新版上线</div>
            <h3 className="text-xl font-bold">NotionNext4.0 轻松定制主题</h3>
          </div>
        </div>
      </div>
    </div>
  )
} 