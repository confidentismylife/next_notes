import Link from 'next/link'

export default function PostsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
                <div className="max-w-7xl ml-24 px-4 h-16 flex items-center">
                    <Link 
                        href="/" 
                        className="text-lg font-semibold hover:text-blue-600 transition-colors"
                    >
                        ← 返回首页
                    </Link>
                </div>
            </nav>
            <div className="pt-16">
                {children}
            </div>
        </div>
    )
} 