# Md文件读取

### **1. 实现缓存**
```typescript
const postCache = new LRUCache<string, Post>({ max: 100 }) //LRU实例
const cacheKey = `${category}:${file}`

if (postCache.has(cacheKey)) {
  tasks.push(Promise.resolve(postCache.get(cacheKey))) //有的话返回
} else {
  const task = MarkdownParser.process(...).then(post => {
    postCache.set(cacheKey, post) // 异步填充缓存
    return post
  })
}
```

---

### **2.  Markdown 解析**
```typescript
// 标题提取
private static extractTitle(content: string) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() // 正则锚点匹配
}

// 目录生成算法
const regex = /^#{2,6}\s+(.+)$/gm
while ((match = regex.exec(content)) !== null) {
  const level = match[0].match(/#/g)!.length - 2 // 计算标题层级
  matches.push('  '.repeat(level) + match[1]) // 生成缩进结构
}


```


---

### **3. 并行任务处理**
```typescript
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
```








