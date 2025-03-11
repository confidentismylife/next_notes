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

  try {
    // 调用DeepSeek API
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
            content: '你是一个专业的文章分析助手，请分析以下文章并提取5-7个关键要点，以简洁的中文列表形式呈现。'
          },
          {
            role: 'user',
            content: `文章标题: ${title}\n\n文章内容: ${content}`
          }
        ],
        temperature: 1.5,
        max_tokens: 1000
      }),
      cache: 'no-store'
    });

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      console.error('DeepSeek API错误:', errorData);
      return { error: 'AI服务暂时不可用' };
    }

    const data = await deepseekResponse.json();
    const summary = data.choices[0].message.content;
    
    // 清除缓存，确保服务器数据是最新的
    revalidatePath('/posts/[slug]');
    
    // 返回纯粹的对象
    return { summary };
  } catch (error) {
    console.error('处理摘要请求时出错:', error);
    return { error: error instanceof Error ? error.message : '未知错误' };
  }
} 