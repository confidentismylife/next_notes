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
// 并行任务处理
const tasks: Promise<Post>[] = []
for (const category of CONFIG.CATEGORIES) {
  const files = await fs.readdir(dir)
  files.filter(f => f.endsWith('.md')).forEach(file => {
    tasks.push(/* 缓存或处理逻辑 */)
  })
}
const posts = await Promise.all(tasks) // 并行执行

// 容错机制
try {
  // 文件操作
} catch (err) {
  console.error(`读取目录失败: ${dir}`, err) // 异常捕获
}
```








