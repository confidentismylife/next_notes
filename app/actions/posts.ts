"use server"

import fs from "fs/promises"
import path from "path"
import type { Post } from "../components/type"
import imglist from "../data/imglist/img"
import { CATEGORIES } from "../components/type"

// Markdown 处理函数
export const processMarkdown = (markdownContent: string): any => {
	if (!markdownContent || markdownContent.trim() === "") {
		console.log("Markdown内容为空！");
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
		console.log("处理Markdown内容，长度:", markdownContent.length);
		console.log("Markdown前100个字符:", markdownContent.substring(0, 100));
		
		// 查找所有的标题行并打印
		const headingLines = markdownContent.match(/^#{1,6}\s+.+$/gm);
		console.log("找到的标题行:", headingLines);
		
		// 提取标题 - 查找第一个 # 开头的行
		const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
		const title = titleMatch ? titleMatch[1].trim() : ""
		console.log("提取的标题:", title);

		// 提取目录 - 查找所有的标题行 (# 开头)
		const tocRegex = /^\s*(#{1,6})\s+(.+)$/gm
		const toc: string[] = []
		
		// 使用正则表达式的exec方法来获取所有匹配
		let match;
		console.log("开始提取目录...");
		let matchCount = 0;
		
		while ((match = tocRegex.exec(markdownContent)) !== null) {
			matchCount++;
			// match[1] 是 # 符号，match[2] 是标题文本
			const level = match[1].length; // 标题级别 (1-6)
			const titleText = match[2].trim();
			console.log(`找到标题 (级别 ${level}): ${titleText}`);
			
			// 添加缩进来表示层级
			const indent = "  ".repeat(level - 1);
			toc.push(`${indent}${titleText}`);
		}
		
		console.log(`正则exec找到 ${matchCount} 个标题`);

		// 如果目录为空，尝试使用另一种正则表达式方法提取
		if (toc.length === 0) {
			console.log("目录为空，尝试备用方法...");
			const headingMatches = markdownContent.match(/^#{1,6}\s+(.+)$/gm);
			if (headingMatches) {
				console.log(`备用方法找到 ${headingMatches.length} 个标题`);
				headingMatches.forEach(heading => {
					const level = (heading.match(/^#+/) || ['#'])[0].length;
					const text = heading.replace(/^#+\s+/, '').trim();
					console.log(`备用方法 - 找到标题 (级别 ${level}): ${text}`);
					const indent = "  ".repeat(level - 1);
					toc.push(`${indent}${text}`);
				});
			} else {
				console.log("备用方法也未找到标题");
				// 测试更宽松的正则表达式
				console.log("尝试更宽松的正则表达式...");
				const looseHeadings = markdownContent.match(/[#]{1,6}\s+\S.*/g);
				console.log("宽松正则找到:", looseHeadings);
			}
		}

		console.log("最终提取的目录:", toc);

		// 计算阅读时间
		const wordCount = markdownContent.length
		const readTime = Math.max(1, Math.ceil(wordCount / 500)) // 每分钟约500字，最少1分钟
        
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

		console.log("返回的结果对象:", {
			title: result.title,
			tocLength: result.toc?.length,
			readTime: result.readTime
		});

		return result
	} catch (error) {
		console.error("处理Markdown内容出错:", error);
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
		const baseDirectory = path.join(process.cwd(), "app/data/posts")
		const categories = ['sise', 'life', 'components']; // 已有的文件夹
		const categoryMapping: Record<string, string> = {
			'sise': CATEGORIES.KNOWLEDGE, // 知识
			'life': CATEGORIES.TALKS,     // 杂谈
			'components': CATEGORIES.COMPONENTS // 组件库
		};
		
		let allPosts: Post[] = [];

		// 检查目录是否存在
		try {
			await fs.access(baseDirectory);
		} catch (error) {
			await fs.mkdir(baseDirectory, { recursive: true });
			return [];
		}

		// 遍历所有分类目录
		for (const category of categories) {
			const categoryDir = path.join(baseDirectory, category);
			
			// 检查分类目录是否存在
			try {
				await fs.access(categoryDir);
			} catch (error) {
				// 如果目录不存在，跳过此分类
				continue;
			}
			
			const files = await fs.readdir(categoryDir);
			const markdownFiles = files.filter((file) => file.endsWith(".md"));
			
			if (markdownFiles.length === 0) {
				continue;
			}
			
			// 处理每个分类中的文件
			const postsPromises = markdownFiles.map(async (filename) => {
				try {
					const filePath = path.join(categoryDir, filename);
					
					// 检查文件是否存在
					try {
						await fs.access(filePath);
					} catch (error) {
						throw new Error(`文件不存在或无法访问: ${filePath}`);
					}
					
					// 获取文件状态
					const stats = await fs.stat(filePath);
					
					if (stats.size === 0) {
						throw new Error(`文件为空: ${filePath}`);
					}
					
					// 尝试不同的编码读取文件
					let content = "";
					try {
						content = await fs.readFile(filePath, "utf8");
					} catch (error) {
						// 读取文件为Buffer，然后尝试不同的编码
						const buffer = await fs.readFile(filePath);
						// 尝试检测BOM
						if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
							content = buffer.toString("utf8", 3);
						} else {
							// 尝试其他编码
							try {
								content = buffer.toString("utf8");
							} catch (e) {
								content = buffer.toString();
							}
						}
					}
					
					if (content.length === 0) {
						throw new Error("文件内容为空");
					}
					
					// 创建摘要，但保留完整内容
					const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
					
					const slug = filename.replace(/\.md$/, "");
					
					// 检查内容是否为有效的Markdown
					if (!content.includes("#") && !content.includes("\n")) {
						// 可以在这里添加验证逻辑
					}
					
					// 直接调用processMarkdown，不要包装成Promise
					const postData = await processMarkdown(content);
					
					if (!postData) {
						throw new Error("处理Markdown内容失败");
					}
					
					// 创建一个新的纯对象，只包含需要的属性
					const cleanPost: Post = {
						slug,
						title: postData.title || "无标题",
						content: postData.content || "",
						excerpt,
						author: postData.author || "Admin",
						authorAvatar: postData.authorAvatar || "/avatars/default.png",
						date: typeof postData.date === "string" ? postData.date : new Date().toISOString(),
						readTime: postData.readTime || 0,
						views: postData.views || 0,
						likes: postData.likes || 0,
						toc: Array.isArray(postData.toc) ? postData.toc : [],
						number: `1-${Math.floor(Math.random() * 100)}`,
						dotColor: postData.dotColor || "#10B981",
						coverImage: postData.coverImage || imglist[Math.floor(Math.random() * imglist.length)].url,
						category: categoryMapping[category] || CATEGORIES.ALL
					};
					
					return cleanPost;
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
						category: categoryMapping[category] || CATEGORIES.ALL
					} as Post;
				}
			});
			
			// 等待当前分类的所有Promise完成
			const categoryPosts = await Promise.all(postsPromises);
			// 合并到总结果中
			allPosts = [...allPosts, ...categoryPosts];
		}
		
		// 返回处理后的文章数组
		return JSON.parse(JSON.stringify(allPosts));
	} catch (error) {
		console.error("获取所有文章失败:", error);
		return [];
	}
}

// 获取单篇文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		console.log(`开始获取文章: ${slug}`);
		const baseDirectory = path.join(process.cwd(), 'app/data/posts');
		const categories = ['sise', 'life', 'components']; // 已有的文件夹
		const categoryMapping: Record<string, string> = {
			'sise': CATEGORIES.KNOWLEDGE, // 知识
			'life': CATEGORIES.TALKS,     // 杂谈
			'components': CATEGORIES.COMPONENTS // 组件库
		};

		// 解码 URL 编码的 slug
		const decodedSlug = decodeURIComponent(slug);
		console.log(`解码后的slug: ${decodedSlug}`);
		
		// 在所有分类目录中搜索匹配的文件
		for (const category of categories) {
			const categoryDir = path.join(baseDirectory, category);
			console.log(`检查分类目录: ${categoryDir}`);
			
			// 检查分类目录是否存在
			try {
				await fs.access(categoryDir);
			} catch (error) {
				// 如果目录不存在，跳过此分类
				console.log(`分类目录不存在: ${categoryDir}`);
				continue;
			}
			
			// 获取目录下所有文件
			const files = await fs.readdir(categoryDir);
			console.log(`目录 ${category} 中的文件:`, files);
			
			// 查找匹配的文件（不区分大小写）
			const matchingFile = files.find(file =>
				file.toLowerCase().replace(/\.md$/, '') === decodedSlug.toLowerCase()
			);
			
			if (!matchingFile) {
				// 在当前分类中没找到，继续查找下一个分类
				console.log(`在 ${category} 中未找到匹配的文件`);
				continue;
			}
			
			console.log(`找到匹配的文件: ${matchingFile} (在 ${category} 分类中)`);
			const filePath = path.join(categoryDir, matchingFile);
			
			// 尝试不同的编码读取文件
			let content = '';
			try {
				console.log(`尝试读取文件: ${filePath}`);
				content = await fs.readFile(filePath, "utf8");
				console.log(`成功读取文件，内容长度: ${content.length}`);
			} catch (error) {
				console.log(`UTF-8读取失败，尝试其他编码方式`);
				// 读取文件为Buffer，然后尝试不同的编码
				const buffer = await fs.readFile(filePath);
				// 尝试检测BOM
				if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
					console.log("检测到BOM，跳过前3个字节");
					content = buffer.toString('utf8', 3);
				} else {
					// 尝试其他编码
					try {
						content = buffer.toString('utf8');
					} catch (e) {
						console.log("所有编码方式都失败，使用默认编码");
						content = buffer.toString();
					}
				}
			}
			
			if (content.length === 0) {
				console.log("文件内容为空，返回null");
				return null;
			}
			
			console.log("文件内容前100个字符:", content.substring(0, 100));
			
			// 确认是否包含Markdown标题
			const hasHeadings = /^#{1,6}\s+.+$/m.test(content);
			console.log(`文件是否包含标题: ${hasHeadings}`);
			
			// 使用processMarkdown处理内容，并等待结果
			console.log("开始处理Markdown内容...");
			const postData = processMarkdown(content);
			
			// 确保 toc 是有效的数组
			const toc = Array.isArray(postData.toc) ? postData.toc : [];
			console.log(`TOC数组长度: ${toc.length}`);
			
			// 确保有标题，如果内容中没有 # 标题，则尝试使用文件名作为标题
			let title = postData.title;
			if (!title || title === "无标题") {
				// 从文件名生成标题
				title = matchingFile.replace(/\.md$/, '').replace(/-/g, ' ');
				// 首字母大写
				title = title.charAt(0).toUpperCase() + title.slice(1);
				console.log(`使用文件名作为标题: ${title}`);
			}
			
			// 确保有封面图
			const coverImage = postData.coverImage || imglist[Math.floor(Math.random() * imglist.length)].url;
			
			// 手动检查一次标题
			if (toc.length === 0) {
				console.log("再次尝试手动提取标题...");
				// 按行分割内容
				const lines = content.split('\n');
				for (const line of lines) {
					const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
					if (headingMatch) {
						const level = headingMatch[1].length;
						const text = headingMatch[2].trim();
						console.log(`手动找到标题: ${text} (级别: ${level})`);
						const indent = "  ".repeat(level - 1);
						toc.push(`${indent}${text}`);
					}
				}
				console.log(`手动提取后TOC长度: ${toc.length}`);
			}
			
			// 创建Post对象
			const post: Post = {
				slug,
				title: title,
				content: content || "",
				author: postData.author || "Admin",
				authorAvatar: postData.authorAvatar || "/avatars/default.png",
				date: typeof postData.date === "string" ? postData.date : new Date().toISOString(),
				readTime: postData.readTime || 1,
				views: postData.views || 0,
				likes: postData.likes || 0,
				toc: toc.filter(Boolean), // 过滤掉空值
				number: `1-${Math.floor(Math.random() * 100)}`,
				dotColor: postData.dotColor || "#10B981",
				coverImage: coverImage,
				excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
				category: categoryMapping[category] || CATEGORIES.ALL
			};
			
			console.log("最终post对象的目录长度:", post.toc.length);
			
			// 确保目录数据有效，通过手动转换确保数据正确
			const serializedToc = JSON.stringify(post.toc);
			console.log("序列化后的目录数据:", serializedToc);
			
			// 如果目录为空，但内容不为空，尝试再次提取目录
			if (post.toc.length === 0 && content) {
				console.log("最终目录仍为空，尝试最后一次提取...");
				const lines = content.split('\n');
				const extractedToc: string[] = [];
				
				for (const line of lines) {
					const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
					if (headingMatch) {
						const level = headingMatch[1].length;
						const text = headingMatch[2].trim();
						console.log(`最终提取找到标题: ${text} (级别: ${level})`);
						const indent = "  ".repeat(level - 1);
						extractedToc.push(`${indent}${text}`);
					}
				}
				
				if (extractedToc.length > 0) {
					post.toc = extractedToc;
					console.log("最终提取成功，目录长度:", extractedToc.length);
				}
			}
			
			// 手动构建结果对象，确保toc数据正确传递
			const result = {
				...JSON.parse(JSON.stringify(post)),
				toc: post.toc // 直接使用处理后的toc数组
			};
			
			console.log("返回的目录数据类型:", typeof result.toc);
			console.log("返回的目录数据长度:", result.toc.length);
			
			return result;
		}
		
		// 如果所有分类都没找到匹配的文件
		console.log(`未找到任何匹配的文件: ${decodedSlug}`);
		throw new Error(`找不到文件: ${decodedSlug}`);
	} catch (error) {
		console.error('获取文章失败:', error);
		return null;
	}
}
