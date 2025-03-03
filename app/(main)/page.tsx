"use client" // 需要添加这个声明来使用客户端组件

import { useEffect, useRef } from "react"
import Typed from "typed.js"
import ScrollButton from "../components/ScrollButton"

export default function Home() {
	// 创建一个 ref 来存储 typed 实例
	const el = useRef(null)
	const typed = useRef<Typed | null>(null)

	useEffect(() => {
		const options = {
			strings: ["欢迎来到我的博客🎉"],
			typeSpeed: 100,
			backSpeed: 50,
			startDelay: 300,
			backDelay: 1500,
			loop: true,
			showCursor: true,
			cursorChar: "|",
			autoInsertCss: true,
			fadeOut: false,
			smartBackspace: true,
		}

		// 确保 el.current 存在
		if (el.current) {
			// 创建新的 Typed 实例
			typed.current = new Typed(el.current, options)
		}

		// 清理函数
		return () => {
			if (typed.current) {
				typed.current.destroy()
			}
		}
	}, []) // 空依赖数组意味着这个效果只在组件挂载时运行一次

	return (
		<div className="w-full">
			{/* 首屏内容 */}
			<div className="first-screen h-screen relative w-full">
				<div className="flex-1 absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold">
					NEXT NOTE
				</div>
				<h1 className="absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
					<span ref={el}></span>
				</h1>
				<ScrollButton />
			</div>

			{/* 第二屏内容 */}
			<div className="min-h-screen bg-white w-full px-8 py-12">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold mb-6">最新文章</h2>
					{/* 文章卡片 */}
					{[1, 2, 3].map((item) => (
						<div key={item} className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h3 className="text-xl font-bold mb-2">文章标题 {item}</h3>
							<p className="text-gray-600 mb-4">
								这里是文章的简介内容，可以显示文章的前几行内容作为预览...
							</p>
							<div className="flex justify-between items-center">
								<div className="flex space-x-4 text-sm text-gray-500">
									<span>2024-03-21</span>
									<span>阅读: 100</span>
									<span>评论: 5</span>
								</div>
								<button className="text-blue-500 hover:text-blue-600">
									阅读更多 →
								</button>
							</div>
						</div>
					))}

					{/* 技术栈展示 */}
					<div className="mt-12">
						<h2 className="text-3xl font-bold mb-6">技术栈</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'].map((tech) => (
								<div key={tech} className="bg-white rounded-lg shadow-md p-4 text-center">
									<span className="font-medium">{tech}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
