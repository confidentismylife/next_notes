"use server";

import fs from "fs/promises";
import path from "path";
import { LRUCache } from "lru-cache";

type Post = {
	slug: string;
	title: string;
	content: string;
	excerpt: string;
	readTime: number;
	category: string;
	coverImage: string;
	author: string;
	authorAvatar: string;
	date: string;
	views: number;
	likes: number;
	toc: string[];
	number: string;
	dotColor: string;
};

const CONFIG = {
	CACHE_MAX: 100,
	POSTS_DIR: path.join(process.cwd(), "app/data/posts"),
	CATEGORIES: ["sise", "life", "components"] as const,
	CATEGORY_MAP: {
		sise: "知识",
		life: "杂谈",
		components: "组件库",
		all: "全部",
	},
};

const postCache = new LRUCache<string, Post>({ max: CONFIG.CACHE_MAX });

class MarkdownParser {
	static async process(filePath: string): Promise<Post> {
		const content = await fs.readFile(filePath, "utf-8");
		const slug = path.basename(filePath, ".md");
		const category = this.getCategory(filePath);

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
		};
	}

	private static extractTitle(content: string) {
		return content.match(/^#\s+(.+)$/m)?.[1]?.trim();
	}

	private static generateTOC(content: string) {
		const matches: string[] = [];
		const regex = /^#{2,6}\s+(.+)$/gm;
		let match;

		while ((match = regex.exec(content)) !== null) {
			const level = match[0].match(/#/g)!.length - 2;
			matches.push("  ".repeat(level) + match[1]);
		}

		return matches;
	}

	private static getCategory(filePath: string) {
		const category = CONFIG.CATEGORIES.find((c) => filePath.includes(c)) || "all";
		return CONFIG.CATEGORY_MAP[category];
	}

	private static randomImage() {
		const images = require("../data/imglist/img").default;
		return images[Math.floor(Math.random() * images.length)]?.url || "";
	}
}

async function processFile(cacheKey: string, dir: string, file: string): Promise<Post> {
	if (postCache.has(cacheKey)) {
		const cachedPost = postCache.get(cacheKey);
		console.log(cachedPost, '命中缓存');
		return cachedPost!;
	} else {
		const post = await MarkdownParser.process(path.join(dir, file));
		postCache.set(cacheKey, post);
		console.log(post, '未命中缓存');
		return post;
	}
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
	const results: T[] = [];
	const queue = [...tasks]; // 创建任务队列副本
	const activeTasks = new Set<Promise<void>>(); // 存储当前正在执行的任务

	async function worker(): Promise<void> {
		while (queue.length > 0) {
			const task = queue.shift(); // 从队列取出任务
			if (task) {
				const promise = task().then(result => {
					results.push(result);
					activeTasks.delete(promise); // 完成后移除任务
				}).catch(error => {
					console.error('任务执行失败:', error);
					activeTasks.delete(promise); // 错误处理后移除任务
				});

				activeTasks.add(promise); // 添加到当前任务集合

				if (activeTasks.size >= concurrency) {
					await Promise.race(activeTasks); // 等待任意一个任务完成
				}
			}
		}
	}

	// 启动指定数量的工作线程
	const workers = Array(concurrency).fill(null).map(() => worker());
	await Promise.all(workers); // 等待所有Worker完成
	return results;
}

export async function getPosts(): Promise<Post[]> {
	const tasks: (() => Promise<Post>)[] = [];

	for (const category of CONFIG.CATEGORIES) {
		const dir = path.join(CONFIG.POSTS_DIR, category);
		try {
			const files = await fs.readdir(dir);

			for (const file of files.filter(f => f.endsWith('.md'))) {
				const cacheKey = `${category}:${file}`;
				console.log(cacheKey, '缓存key');
				tasks.push(() => processFile(cacheKey, dir, file));
			}
		} catch (err) {
			console.error(`读取目录失败: ${dir}`, err);
		}
	}

	// 控制并发数为10
	const posts = await runWithConcurrency(tasks, 10);
	return posts.sort((a, b) => 
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

export async function getPost(slug: string): Promise<Post | null> {
	const decodedSlug = decodeURIComponent(slug);

	for (const category of CONFIG.CATEGORIES) {
		const filePath = path.join(CONFIG.POSTS_DIR, category, `${decodedSlug}.md`);
		const cacheKey = `${category}:${decodedSlug}.md`;

		if (postCache.has(cacheKey)) {
			console.log(postCache.get(cacheKey), '命中缓存');
			return postCache.get(cacheKey)!;
		}

		try {
			const post = await MarkdownParser.process(filePath);
			postCache.set(cacheKey, post);
			return post;
		} catch {
			continue; // 文件不存在则继续查找
		}
	}

	return null;
}