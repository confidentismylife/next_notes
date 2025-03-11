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
import React from 'react'
import AISummaryHelper from '@/app/components/AISummaryHelper'

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
    console.log(`渲染文章页面: ${params.slug}`);
    const post = await getPostBySlug(params.slug)

    if (!post) {
        console.log(`未找到文章: ${params.slug}`);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600">文章不存在</p>
                </div>
            </div>
        )
    }

    
    // 确保目录数据有效
    // 修改这里的逻辑，确保即使在开发环境中也能正确处理目录数据
    let tocData = [];
    
    // 检查 post.toc 是否为有效数组
    if (Array.isArray(post.toc)) {
        tocData = post.toc;
    } else if (typeof post.toc === 'string') {
        // 如果是字符串，尝试解析为JSON
        try {
            const parsed = JSON.parse(post.toc);
            if (Array.isArray(parsed)) {
                tocData = parsed;
            }
        } catch (e) {
            console.error("无法解析目录数据:", e);
        }
    }
    
    // 如果目录仍然为空，但我们有文章内容，尝试手动提取目录
    if (tocData.length === 0 && post.content) {

        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        let match;
        while ((match = headingRegex.exec(post.content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const indent = "  ".repeat(level - 1);
            tocData.push(`${indent}${text}`);
        }
    }
        

    const components: Components = {
        h1: ({ children }) => (
            <h1 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-3xl font-bold mb-4 mt-8">
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
        h4: ({ children }) => (
            <h4 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-lg font-bold mt-5 mb-2">
                {children}
            </h4>
        ),
        h5: ({ children }) => (
            <h5 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-base font-bold mt-4 mb-2">
                {children}
            </h5>
        ),
        h6: ({ children }) => (
            <h6 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="text-sm font-bold mt-4 mb-2">
                {children}
            </h6>
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
                <>
                    <Image
                        src={imageSrc}
                        alt={alt || ''}
                        width={800}
                        height={400}
                        className="rounded-lg mx-auto my-4"
                        style={{ objectFit: 'contain' }}
                    />
                    {alt && (
                        <span className="block text-center text-sm text-gray-500 mt-2">{alt}</span>
                    )}
                </>
            )
        },
        p({ children, node }) {
            // 检查children中是否有块级元素（React组件）
            // 如果有任何子元素是React组件或包含块级标签的HTML字符串，使用div代替p
            const hasBlockElements = React.Children.toArray(children).some(child => 
                React.isValidElement(child) && 
                ['div', 'section', 'article', 'aside', 'figure', 'blockquote'].includes(
                    (child.type as any)?.name?.toLowerCase() || ''
                )
            );
            
            if (hasBlockElements) {
                return <div className="mb-4 leading-relaxed">{children}</div>;
            }
            
            return <p className="mb-4 leading-relaxed">{children}</p>;
        }
    }

    // 确保只传递简单类型给客户端组件
    const postContent = post?.content ? String(post.content) : "";
    const postTitle = post?.title ? String(post.title) : "";
    const postSlug = params.slug ? String(params.slug) : "";

    return (
        <div className="min-h-screen bg-gray-50 py-12 flex justify-start px-4">
            {/* 左侧目录 */}
            <div className="w-96 flex-shrink-0">
                <TableOfContents toc={tocData} />
            </div>
            
            {/* 中间文章内容 */}
            <div className="flex-grow max-w-3xl pl-12">
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
                        {post.category && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                post.category === '知识' ? 'bg-blue-100 text-blue-700' :
                                post.category === '组件库' ? 'bg-purple-100 text-purple-700' :
                                post.category === '杂谈' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {post.category}
                            </span>
                        )}
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

                {/* 文章内容 */}layers.js
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
            
            {/* 右侧AI小助手 */}
            <div className="w-[320px] flex-shrink-0 ml-16">
                <AISummaryHelper 
                    content={postContent} 
                    title={postTitle} 
                    slug={postSlug} 
                />
            </div>
        </div>
    )
} 