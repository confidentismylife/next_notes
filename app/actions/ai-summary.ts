'use server'

import { revalidatePath } from "next/cache"

const MAX_RETRIES = 2
const BASE_DELAY = 1000
const API_TIMEOUT = 15000

type SummaryResult = { summary: string } | { error: string }

export async function summarizeContent({ content, title }: { content: string; title: string }): Promise<SummaryResult> {
  if (!content) return { error: "内容不能为空" }

  const fetchWithRetry = async (retry = 0): Promise<Response> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [{
            role: "system",
            content: "生成3-5个中文关键点，每点不超过20字，用•符号列表"
          }, {
            role: "user",
            content: `标题: ${title}\n内容: ${content.slice(0, 3000)}`  // 限制上下文长度
          }],
          temperature: 0.5,
          max_tokens: 150
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response.ok ? response : Promise.reject(response)
    } catch (error) {
      clearTimeout(timeoutId)
      if (retry < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, BASE_DELAY * (2 ** retry)))
        return fetchWithRetry(retry + 1)
      }
      throw error
    }
  }

  try {
    const { choices: [ { message } ] } = await (await fetchWithRetry()).json()
    revalidatePath('/posts/[slug]')
    return { summary: message.content }
  } catch (error) {
    const message = error instanceof Error ? error.message : '服务暂时不可用'
    return { error: `摘要生成失败: ${message}` }
  }
}