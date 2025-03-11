'use server'

import { revalidatePath } from "next/cache";

interface SummarizeProps {
  content: string;
  title: string;
}

export async function summarizeContent({ content, title }: SummarizeProps) {
  if (!content) {
    throw new Error('没有提供内容');
  }

  // 实现重试逻辑的辅助函数
  async function fetchWithTimeout(url: string, options: any, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // 重试机制
  async function fetchWithRetry(url: string, options: any, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetchWithTimeout(url, options);
        if (response.ok) return response;
        
        const errorData = await response.json();
        console.error(`尝试 ${i + 1}/${retries + 1} 失败:`, errorData);
        
        if (i === retries) throw new Error(errorData.error || '请求失败');
        
        // 指数退避重试
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } catch (error) {
        if (i === retries) throw error;
        console.error(`重试 ${i + 1}/${retries + 1}:`, error);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  try {
    // 优化提示词，限制输出长度
    const prompt = `请简要总结以下文章的3-5个关键点，使用简洁的中文，每点不超过20字。\n\n标题: ${title}\n\n内容: ${content}`;

    const response = await fetchWithRetry('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          {
            role: 'system',
            content: '你是一个简洁的文章摘要助手。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // 降低创造性，提高响应速度
        max_tokens: 500,  // 限制输出长度
        presence_penalty: 0,
        frequency_penalty: 0
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    const summary = data.choices[0].message.content;
    
    revalidatePath('/posts/[slug]');
    return { summary };
  } catch (error) {
    console.error('处理摘要请求时出错:', error);
    return { 
      error: error instanceof Error 
        ? `AI 服务暂时不可用: ${error.message}` 
        : '未知错误' 
    };
  }
} 