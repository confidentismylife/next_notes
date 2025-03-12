'use server'

import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

// 配置常量
const CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXT: '.md',
  POSTS_DIR: path.join(process.cwd(), 'app/data/posts'),
  SLUG_LENGTH: 50,
  FILENAME_LENGTH: 12
}

// 类型定义
type UploadResult = 
  | { success: true; slug: string; fileName: string }
  | { success: false; error: string }

// 辅助函数：生成安全文件名
const generateSafeName = (length = CONFIG.FILENAME_LENGTH) => {
  const buffer = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(buffer, b => b.toString(36)).join('').substring(0, length)
}

// 辅助函数：生成有效slug
const generateSlug = (title: string) => {
  return title
    .normalize('NFD') // 分解重音字符
    .replace(/[\u0300-\u036f]/g, '') // 移除变音符号
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除非slug允许字符
    .replace(/\s+/g, '-')
    .substring(0, CONFIG.SLUG_LENGTH)
}

export async function uploadMarkdown(formData: FormData): Promise<UploadResult> {
  try {
    // 获取并验证文件
    const file = formData.get('file') as File
    if (!file?.size) return { success: false, error: '无效文件输入' }

    // 验证文件类型
    if (!file.name.endsWith(CONFIG.ALLOWED_EXT)) {
      return { success: false, error: '仅支持Markdown文件' }
    }

    // 验证文件大小
    if (file.size > CONFIG.MAX_SIZE) {
      return { success: false, error: '文件大小超过10MB限制' }
    }

    // 读取并验证内容
    const content = await file.text()
    if (!content.trim()) return { success: false, error: '文件内容为空' }

    // 生成安全文件名
    const fileName = `${Date.now()}-${generateSafeName()}${CONFIG.ALLOWED_EXT}`
    const filePath = path.join(CONFIG.POSTS_DIR, fileName)

    // 创建存储目录
    await fs.mkdir(CONFIG.POSTS_DIR, { recursive: true })

    // 写入文件
    await fs.writeFile(filePath, content)

    // 提取标题生成slug
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const slug = generateSlug(titleMatch?.[1] || fileName)

    // 刷新缓存
    const revalidatePaths = [
      '/',
      '/posts',
      '/posts/[slug]'
    ]
    await Promise.allSettled(revalidatePaths.map(p => revalidatePath(p)))

    return { 
      success: true,
      slug,
      fileName
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '服务器内部错误'
    }
  }
}