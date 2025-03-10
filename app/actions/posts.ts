"use server"

import fs from "fs/promises"
import path from "path"
import type { Post } from "../components/type"
import imglist from "../data/imglist/img"

// Markdown 处理函数
export const processMarkdown = (markdownContent: string): any => {
	if (!markdownContent || markdownContent.trim() === "") {
		return {
			title: "无标题",
			content: "",
			toc: [],
			readTime: 0,
			views: 0,
			likes: 0,
			date: new Date().toISOString(),
			author: "Admin",
			authorAvatar: "/avatars/default.png",
			dotColor: "#10B981",
			coverImage: imglist[Math.floor(Math.random() * imglist.length)].url
		}
	}

	try {
		// 提取标题
		const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
		const title = titleMatch ? titleMatch[1] : ""

		// 提取目录
		const tocRegex = /^#{1,6}\s+(.+)$/gm
		const toc: string[] = []

		// 使用String.match而不是RegExp.exec来获取所有匹配
		const matches = markdownContent.match(tocRegex)

		if (matches) {
			for (const match of matches) {
				const titleText = match.replace(/^#{1,6}\s+/, "")
				toc.push(titleText)
			}
		}

		const wordCount = markdownContent.length
		const readTime = Math.ceil(wordCount / 300)
        
		// 创建摘要 (如果需要)
		const excerpt = markdownContent.substring(0, 150) + (markdownContent.length > 150 ? '...' : '')

		// 创建结果对象
		const result: Partial<Post> = {
			title,
			content: markdownContent,
			excerpt,
			toc,
			readTime,
			views: 0,
			likes: 0,
			date: new Date().toISOString(),
			author: "Admin",
			authorAvatar: "/avatars/default.png",
			dotColor: "#10B981",
			coverImage: imglist[Math.floor(Math.random() * imglist.length)].url
		}

		return result
	} catch (error) {
		return {
			title: "处理错误",
			content: markdownContent,
			toc: [],
			readTime: 1,
			views: 0,
			likes: 0,
			date: new Date().toISOString(),
			author: "Admin",
			authorAvatar: "/avatars/default.png",
			dotColor: "#FF0000",
		}
	}
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
	try {
		const postsDirectory = path.join(process.cwd(), "app/data/posts")

		// 检查目录是否存在
		try {
			await fs.access(postsDirectory)
		} catch (error) {
			await fs.mkdir(postsDirectory, { recursive: true })
		}

		const files = await fs.readdir(postsDirectory)

		if (files.length === 0) {
			return []
		}

		const markdownFiles = files.filter((file) => file.endsWith(".md"))

		if (markdownFiles.length === 0) {
			return []
		}

		// 使用map和Promise.all处理所有文件
		const postsPromises = markdownFiles.map(async (filename) => {
			try {
				const filePath = path.join(postsDirectory, filename)

				// 检查文件是否存在
				try {
					await fs.access(filePath)
				} catch (error) {
					throw new Error(`文件不存在或无法访问: ${filePath}`)
				}

				// 获取文件状态
				const stats = await fs.stat(filePath)

				if (stats.size === 0) {
					throw new Error(`文件为空: ${filePath}`)
				}

				// 尝试不同的编码读取文件
				let content = ""
				try {
					content = await fs.readFile(filePath, "utf8")
				} catch (error) {
					// 读取文件为Buffer，然后尝试不同的编码
					const buffer = await fs.readFile(filePath)
					// 尝试检测BOM
					if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
						content = buffer.toString("utf8", 3)
					} else {
						// 尝试其他编码
						try {
							content = buffer.toString("utf8")
						} catch (e) {
							content = buffer.toString()
						}
					}
				}

				if (content.length === 0) {
					throw new Error("文件内容为空")
				}
                
				// 创建摘要，但保留完整内容
				const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '')
                
				const slug = filename.replace(/\.md$/, "")

				// 检查内容是否为有效的Markdown
				if (!content.includes("#") && !content.includes("\n")) {
				}

				// 直接调用processMarkdown，不要包装成Promise
				const postData = await processMarkdown(content)

				if (!postData) {
					throw new Error("处理Markdown内容失败")
				}

				// 创建一个新的纯对象，只包含需要的属性
				const cleanPost: Post = {
					slug,
					title: postData.title || "无标题",
					content: postData.content || "",
					excerpt: excerpt,
					author: postData.author || "Admin",
					authorAvatar: postData.authorAvatar || "/avatars/default.png",
					date: typeof postData.date === "string" ? postData.date : new Date().toISOString(),
					readTime: postData.readTime || 0,
					views: postData.views || 0,
					likes: postData.likes || 0,
					toc: Array.isArray(postData.toc) ? postData.toc : [],
					number: `1-${Math.floor(Math.random() * 100)}`,
					dotColor: postData.dotColor || "#10B981",
					coverImage: postData.coverImage || imglist[Math.floor(Math.random() * imglist.length)].url
				}

				return cleanPost
			} catch (error) {
				// 返回一个带有基本信息的对象，避免整个列表因为一个文件出错而失败
				return {
					slug: filename.replace(/\.md$/, ""),
					title: `无法加载 (${filename})`,
					content: "",
					author: "System",
					authorAvatar: "/avatars/default.png",
					date: new Date().toISOString(),
					readTime: 0,
					views: 0,
					likes: 0,
					toc: [],
					number: `1-${Math.floor(Math.random() * 100)}`,
					dotColor: "#FF0000",
				} as Post
			}
		})

		// 等待所有Promise完成
		const posts = await Promise.all(postsPromises)

		// 返回处理后的文章数组
		return JSON.parse(JSON.stringify(posts))
	} catch (error) {
		return []
	}
}

// 获取单篇文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		const postsDirectory = path.join(process.cwd(), 'app/data/posts');

		// 解码 URL 编码的 slug
		const decodedSlug = decodeURIComponent(slug);

		// 获取目录下所有文件
		const files = await fs.readdir(postsDirectory);

		// 查找匹配的文件（不区分大小写）
		const matchingFile = files.find(file =>
			file.toLowerCase().replace(/\.md$/, '') === decodedSlug.toLowerCase()
		);

		if (!matchingFile) {
			throw new Error(`找不到文件: ${decodedSlug}`);
		}

		const filePath = path.join(postsDirectory, matchingFile);

		// 尝试不同的编码读取文件
		let content = '';
		try {
			content = await fs.readFile(filePath, "utf8");
		} catch (error) {
			// 读取文件为Buffer，然后尝试不同的编码
			const buffer = await fs.readFile(filePath);
			// 尝试检测BOM
			if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
				content = buffer.toString('utf8', 3);
			} else {
				// 尝试其他编码
				try {
					content = buffer.toString('utf8');
				} catch (e) {
					content = buffer.toString();
				}
			}
		}

		if (content.length > 0) {
			// 不要截取内容，保留完整的Markdown文件内容
			// content = content.substring(0, 100);
		} else {
			throw new Error("文件内容为空");
		}

		// 直接调用processMarkdown，不要包装成Promise
		const post = await processMarkdown(content);

		// 创建一个新的纯对象，只包含需要的属性
		const cleanPost: Post = {
			slug: decodedSlug,
			title: post.title || "无标题",
			content: post.content || "",
			author: post.author || "Admin",
			authorAvatar: post.authorAvatar || "/avatars/default.png",
			date: typeof post.date === "string" ? post.date : new Date().toISOString(),
			readTime: post.readTime || 0,
			views: post.views || 0,
			likes: post.likes || 0,
			toc: Array.isArray(post.toc) ? post.toc : [],
			number: `1-${Math.floor(Math.random() * 100)}`,
			dotColor: post.dotColor || "#10B981",
			coverImage: post.coverImage || imglist[Math.floor(Math.random() * imglist.length)].url
		};

		// 返回处理后的文章对象
		return JSON.parse(JSON.stringify(cleanPost));
	} catch (error) {
		return null;
	}
}
