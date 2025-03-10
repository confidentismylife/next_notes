import Link from 'next/link'
import Image from 'next/image'

interface TimelinePostProps {
    number: string;
    title: string;
    content: string;
    isEven: boolean;
    dotColor: string;
    slug: string;
    coverImage?: string;
}

export default function TimelinePost({ number, title, content, isEven, dotColor, slug, coverImage }: TimelinePostProps) {
    // 获取内容的前两行
    const previewContent = content
        .split('\n')
        .filter(line => line.trim() !== '')
        .slice(0, 2)
        .join('\n')

    return (
        <div className={`relative flex ${isEven ? 'justify-end' : ''}`}>
            <div className="absolute left-1/2 top-8 h-4 w-4 rounded-full border-2 bg-white -translate-x-1/2"
                style={{ borderColor: dotColor }}
            ></div>
            <div className={`w-[calc(50%-2rem)] ${isEven ? 'pl-8' : 'pr-8'}`}>
                <Link href={`/posts/${slug}`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
                        {coverImage && (
                            <div className="-mx-6 -mt-6 mb-4">
                                <Image
                                    src={coverImage}
                                    alt={title}
                                    width={800}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        )}
                        <span className="text-sm text-gray-500 mb-2 block">{number}</span>
                        <h2 className="text-2xl font-bold mb-4">{title}</h2>
                        <div className="text-gray-600 line-clamp-2">
                            <p>{previewContent}</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
} 