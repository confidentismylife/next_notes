import { getPostBySlug, getAllPosts } from '@/app/actions/posts'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import type { Components } from 'react-markdown'
import TableOfContents from '@/app/components/TableOfContents'

// 注册语言支持
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('nginx', nginx)
SyntaxHighlighter.registerLanguage('css', css)

// 生成静态路径
export async function generateStaticParams() {
    const posts = await getAllPosts()
    // 确保所有 slug 都被正确处理，不包含空格
    return posts.map((post) => ({
        slug: post.slug.trim().replace(/\s+/g, '-'),
    }))
}

// 定义组件
export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug)

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600">文章不存在</p>
                </div>
            </div>
        )
    }

    const components: Components = {
        h1: ({ children }) => (
            <h1 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-3xl font-bold mb-4">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-2xl font-bold mt-8 mb-4">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-xl font-bold mt-6 mb-3">
                {children}
            </h3>
        ),
        code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (!className) {
                return <code className="bg-gray-100 rounded px-1">{children}</code>
            }
            
            return (
                <SyntaxHighlighter
                    style={tomorrow}
                    language={language}
                    PreTag="div"
                    className="rounded-lg my-4"
                    showLineNumbers={true}
                    wrapLines={true}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            )
        },
        img({ src, alt }) {
            if (!src) return null
            
            const imageSrc = src.startsWith('/') ? src : `/posts/images/${src}`
            
            return (
                <div className="my-4">
                    <Image
                        src={imageSrc}
                        alt={alt || ''}
                        width={800}
                        height={400}
                        className="rounded-lg mx-auto"
                        style={{ objectFit: 'contain' }}
                    />
                    {alt && (
                        <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>
                    )}
                </div>
            )
        },
        p({ children }) {
            return <p className="mb-4 leading-relaxed">{children}</p>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* 左侧目录 */}
            <TableOfContents toc={post.toc} />
            
            <div className="max-w-4xl mx-auto px-4 ml-96">
                {/* 文章头部信息 */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Image
                            src={'/dog.jpg'}
                            alt={post.author || "作者"}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">我只想说无所谓</h2>
                            <p className="text-gray-500 text-sm">{post.date}</p>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span>{post.readTime} 分钟阅读</span>
                    </div>
                    {post.coverImage && (
                        <div className="mt-6 -mx-8">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={1200}
                                height={800}
                                className="w-full h-[500px] object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* 文章内容 */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
} 