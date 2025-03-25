"use server"

import fs from "fs/promises"
import path from "path"
import { LRUCache } from "lru-cache"

type Post = {
	slug: string
	title: string
	content: string
	excerpt: string
	readTime: number
	category: string
	coverImage: string
	author: string
	authorAvatar: string
	date: string
	views: number
	likes: number
	toc: string[]
	number: string
	dotColor: string
}

const CONFIG = {
	CACHE_MAX: 100,
	// 确保在不同环境下都能正确找到文件路径
	POSTS_DIR: process.env.NODE_ENV === 'production' 
		? path.join(process.cwd(), "app/data/posts")  
		: path.join(process.cwd(), "app/data/posts"),
	CATEGORIES: ["sise", "life", "components"] as const,
	CATEGORY_MAP: {
		sise: "知识",
		life: "杂谈",
		components: "组件库",
		all: "全部",
	},
}

const postCache = new LRUCache<string, Post>({ max: CONFIG.CACHE_MAX })

class MarkdownParser {
	static async process(filePath: string): Promise<Post> {
		try {
			const content = await fs.readFile(filePath, "utf-8")
			const slug = path.basename(filePath, ".md")
			const category = this.getCategory(filePath)

			return {
				slug: encodeURIComponent(slug),
				title: this.extractTitle(content) || slug,
				content,
				excerpt: content.slice(0, 150) + (content.length > 150 ? "..." : ""),
				readTime: Math.ceil(content.length / 500),
				category,
				coverImage: this.randomImage(),
				author: "我只想说无所谓",
				authorAvatar: "/dog.jpg",
				date: new Date().toISOString(),
				views: Math.floor(Math.random() * 100) + 10,
				likes: Math.floor(Math.random() * 100),
				toc: this.generateTOC(content),
				number: `#${Math.floor(Math.random() * 1000)}`,
				dotColor: ["#1E88E5", "#43A047", "#FB8C00"][Math.floor(Math.random() * 3)],
			}
		} catch (error) {
			console.error(`处理文件失败: ${filePath}`, error)
			throw error
		}
	}

	private static extractTitle(content: string) {
		return content.match(/^#\s+(.+)$/m)?.[1]?.trim()
	}

	private static generateTOC(content: string) {
		const matches: string[] = []
		const regex = /^#{2,6}\s+(.+)$/gm
		let match

		while ((match = regex.exec(content)) !== null) {
			const level = match[0].match(/#/g)!.length - 2
			matches.push("  ".repeat(level) + match[1])
		}

		return matches
	}

	private static getCategory(filePath: string) {
		const category = CONFIG.CATEGORIES.find((c) => filePath.includes(c)) || "all"
		return CONFIG.CATEGORY_MAP[category]
	}

	private static randomImage() {
		const images = require("../data/imglist/img").default
		return images[Math.floor(Math.random() * images.length)]?.url || ""
	}
}

async function processFile(cacheKey: string, dir: string, file: string): Promise<Post> {
	if (postCache.has(cacheKey)) {
		const cachedPost = postCache.get(cacheKey)
		console.log(cachedPost, "命中缓存")
		return cachedPost!
	} else {
		const post = await MarkdownParser.process(path.join(dir, file))
		postCache.set(cacheKey, post)
		console.log(post, "未命中缓存")
		return post
	}
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
	const results: T[] = []
	const queue = [...tasks] // 创建任务队列副本
	const activeTasks = new Set<Promise<any>>() // 存储当前正在执行的任务

	// 在 worker 函数中：
	async function worker(): Promise<void> {
		while (queue.length > 0) {
			const task = queue.shift()
			if (task) {
				const originalPromise = task() // ✅ 获取原始 Promise

				originalPromise
					.then((result) => {
						results.push(result)
					})
					.catch((error) => {
						console.error("任务执行失败:", error)
					})

				// 将原始 Promise 存入 activeTasks
				activeTasks.add(originalPromise)

				// 完成后删除原始 Promise
				originalPromise.finally(() => {
					activeTasks.delete(originalPromise)
				})

				if (activeTasks.size >= concurrency) {
					await Promise.race(activeTasks) // ✅ 转换为数组
				}
			}
		}
	}

	await worker() // 等待所有Worker完成
	return results
}

export async function getPosts(): Promise<Post[]> {
	const tasks: (() => Promise<Post>)[] = []
	const allPosts: Post[] = []

	// 检查文件夹是否存在
	try {
		await fs.access(CONFIG.POSTS_DIR)
	} catch (err) {
		console.error(`无法访问目录: ${CONFIG.POSTS_DIR}`, err)
		return [] // 如果目录不存在，返回空数组
	}

	for (const category of CONFIG.CATEGORIES) {
		const dir = path.join(CONFIG.POSTS_DIR, category)
		try {
			// 检查子目录是否存在
			try {
				await fs.access(dir)
			} catch (err) {
				console.warn(`跳过不存在的目录: ${dir}`)
				continue
			}

			const files = await fs.readdir(dir)
			
			// 确保文件列表不为空
			if (!files || files.length === 0) {
				console.warn(`目录为空: ${dir}`)
				continue
			}

			for (const file of files.filter((f) => f.endsWith(".md"))) {
				console.log("file", file)
				const cacheKey = `${category}:${file}`
				console.log(cacheKey, "缓存key")
				tasks.push(() => processFile(cacheKey, dir, file))
			}
		} catch (err) {
			console.error(`读取目录失败: ${dir}`, err)
		}
	}

	// 如果没有找到任何任务，可能是路径有问题
	if (tasks.length === 0) {
		console.error('未找到任何文章文件，请检查文件路径配置')
		return []
	}

	// 控制并发数为10
	try {
		const posts = await runWithConcurrency(tasks, 10)
		return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	} catch (error) {
		console.error('处理文章失败:', error)
		return []
	}
}

export async function getPost(slug: string): Promise<Post | null> {
	const decodedSlug = decodeURIComponent(slug)
	console.log(`尝试获取文章: ${decodedSlug}`)

	// 检查缓存中是否已有这篇文章
	for (const category of CONFIG.CATEGORIES) {
		const cacheKey = `${category}:${decodedSlug}.md`
		if (postCache.has(cacheKey)) {
			console.log(`${cacheKey} 命中缓存`)
			return postCache.get(cacheKey)!
		}
	}

	// 如果在线上环境中无法直接读取文件，可以使用已经生成的文章列表
	if (process.env.NODE_ENV === 'production') {
		// 尝试通过获取所有文章列表来找到匹配的文章
		try {
			const allPosts = await getPosts()
			const post = allPosts.find(p => p.slug === slug || p.slug === decodedSlug)
			if (post) {
				console.log(`在所有文章中找到匹配: ${slug}`)
				return post
			}
		} catch (error) {
			console.error(`获取所有文章失败:`, error)
		}
	}

	// 尝试从文件系统获取
	for (const category of CONFIG.CATEGORIES) {
		const filePath = path.join(CONFIG.POSTS_DIR, category, `${decodedSlug}.md`)
		const cacheKey = `${category}:${decodedSlug}.md`

		try {
			console.log(`尝试读取文件: ${filePath}`)
			// 检查文件是否存在
			try {
				await fs.access(filePath)
			} catch (err) {
				console.log(`文件不存在: ${filePath}`)
				continue
			}

			const post = await MarkdownParser.process(filePath)
			postCache.set(cacheKey, post)
			return post
		} catch (error) {
			console.error(`处理文件失败: ${filePath}`, error)
			continue // 文件不存在则继续查找
		}
	}

	console.log(`未找到文章: ${slug}`)
	return null
}
