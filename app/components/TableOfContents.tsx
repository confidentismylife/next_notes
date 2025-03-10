'use client'

interface TableOfContentsProps {
    toc: string[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
    const handleClick = (item: string) => {
        const element = document.getElementById(item.toLowerCase().replace(/\s+/g, '-'))
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="sticky top-16 bg-white rounded-xl shadow-sm p-6 mx-4" style={{ maxHeight: 'calc(100vh - 160px)' }}>
            <h3 className="text-lg font-semibold mb-4">目录</h3>
            <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                <ul className="space-y-2">
                    {toc?.map((item, index) => (
                        <li 
                            key={index} 
                            className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm"
                            onClick={() => handleClick(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
} 