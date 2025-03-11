import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: '没有提供内容' },
        { status: 400 }
      );
    }

    // 调用DeepSeek API
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      console.error('DeepSeek API错误:', errorData);
      return NextResponse.json(
        { error: 'AI服务暂时不可用' },
        { status: 500 }
      );
    }

    const data = await deepseekResponse.json();
    const summary = data.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('处理摘要请求时出错:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 