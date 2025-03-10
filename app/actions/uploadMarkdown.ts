'use server'

import fs from 'fs/promises'
import path from 'path'
import { processMarkdown } from './posts'
import { revalidatePath } from 'next/cache'

// 生成随机文件名的函数
function generateRandomFileName() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timestamp = Date.now();
  let result = '';
  
  // 生成8位随机字符
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `post-${timestamp}-${result}.md`;
}

export async function uploadMarkdown(formData: FormData) {
  try {
    console.log("开始处理上传的Markdown文件");
    
    // 获取上传的文件
    const file = formData.get('file') as File
    if (!file) {
      console.error("没有找到文件");
      return { success: false, error: '没有找到文件' }
    }
    
    console.log("文件名:", file.name, "文件大小:", file.size, "字节");

    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.md')) {
      console.error("文件类型不正确:", file.name);
      return { success: false, error: '只支持 Markdown (.md) 文件' }
    }

    // 验证文件大小（限制为 10MB）
    if (file.size > 10 * 1024 * 1024) {
      console.error("文件太大:", file.size, "字节");
      return { success: false, error: '文件大小不能超过 10MB' }
    }

    // 读取文件内容
    const content = await file.text()
    console.log("文件内容长度:", content.length);
    console.log("文件内容前100个字符:", content.substring(0, 100));
    
    // 验证内容是否为空
    if (!content.trim()) {
      console.error("文件内容为空");
      return { success: false, error: '文件内容不能为空' }
    }
    
    // 处理文件名（使用原始文件名，去掉扩展名作为slug）
    const originalFilename = file.name
    
    // 生成随机文件名，避免中文文件名乱码问题
    const randomFileName = generateRandomFileName()
    console.log("原始文件名:", originalFilename, "随机文件名:", randomFileName);
    
    // 使用原始文件名（去掉扩展名）作为slug，但如果有中文可能会有问题
    // 可以考虑从文件内容中提取标题作为slug
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : ''
    
    // 如果有标题，使用标题的英文和数字字符作为slug，否则使用随机文件名的一部分
    let slug = '';
    if (title) {
      // 从标题中提取英文和数字，替换空格为短横线
      slug = title.toLowerCase()
        .replace(/[^\w\s]/g, '') // 移除非单词字符
        .replace(/\s+/g, '-')    // 替换空格为短横线
        .substring(0, 50);       // 限制长度
      
      // 如果slug为空（例如标题全是中文），则使用随机部分
      if (!slug) {
        slug = randomFileName.replace(/\.md$/, '');
      }
    } else {
      // 没有标题，使用随机文件名（去掉扩展名）
      slug = randomFileName.replace(/\.md$/, '');
    }
    
    console.log("处理后的slug:", slug);
    
    // 保存文件到posts目录
    const postsDirectory = path.join(process.cwd(), 'app/data/posts')
    console.log("posts目录:", postsDirectory);
    
    // 检查目录是否存在
    try {
      await fs.access(postsDirectory)
      console.log("posts目录存在");
    } catch (error) {
      console.log("posts目录不存在，正在创建...");
      // 确保目录存在
      await fs.mkdir(postsDirectory, { recursive: true })
      console.log("posts目录已创建");
    }
    
    const filePath = path.join(postsDirectory, randomFileName)
    console.log("文件保存路径:", filePath);
    
    // 写入文件
    await fs.writeFile(filePath, content, 'utf8')
    console.log("文件已保存");
    
    // 测试文件是否正确保存
    try {
      const savedContent = await fs.readFile(filePath, 'utf8')
      console.log("保存的文件内容长度:", savedContent.length);
      console.log("保存的文件内容前100个字符:", savedContent.substring(0, 100));
      
      // 测试processMarkdown函数
      const processedPost = processMarkdown(savedContent)
      console.log("处理后的post:", JSON.stringify(processedPost, null, 2));
    } catch (error) {
      console.error("读取保存的文件时出错:", error);
    }
    
    // 重新验证路径，以便更新缓存
    revalidatePath('/')
    revalidatePath('/posts')
    revalidatePath('/posts/[slug]', 'layout')  // 刷新文章详情页布局
    revalidatePath('/posts/[slug]', 'page')    // 刷新文章详情页内容
    console.log("所有相关路径已重新验证");
    
    return { 
      success: true, 
      fileName: randomFileName,
      originalName: originalFilename,
      slug,
      needsRefresh: true  // 添加标志位表示需要刷新
    }
  } catch (error) {
    console.error('上传Markdown文件失败:', error)
    return { 
      success: false, 
      error: '上传失败，请重试' 
    }
  }
} 