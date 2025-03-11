'use client'

import { useState, useEffect } from 'react'
import { summarizeContent } from '../actions/ai-summary'

interface AISummaryHelperProps {
  content: string;
  title: string;
  slug: string;
}

export default function AISummaryHelper({ content, title, slug }: AISummaryHelperProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 生成本地存储的键
  const storageKey = `article-summary-${slug}`;
  
  // 获取摘要的函数
  const getSummary = async (forceRefresh = false) => {
    // 如果不是强制刷新，检查localStorage
    if (!forceRefresh) {
      const cachedSummary = localStorage.getItem(storageKey);
      if (cachedSummary) {
        setSummary(cachedSummary);
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await summarizeContent({ 
        content: String(content), // 确保是字符串
        title: String(title) // 确保是字符串
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.summary) {
        setSummary(result.summary);
        // 保存到localStorage
        localStorage.setItem(storageKey, result.summary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      console.error('获取AI摘要时出错:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 组件挂载时自动请求摘要
  useEffect(() => {
    getSummary();
  }, [slug]);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-16">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 text-blue-500 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
            />
          </svg>
          AI 小助手
        </h3>
        <button
          onClick={() => getSummary(true)} // 强制刷新
          disabled={loading}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 
                    transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
        >
          {loading ? '生成中...' : '刷新'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {summary && !loading && (
        <div className="prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed">
            <h4 className="text-base font-medium mb-2 text-gray-900">主要内容摘要：</h4>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap max-h-[calc(100vh-260px)] overflow-y-auto">
              {summary}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-3 flex justify-end">
            由 DeepSeek AI 提供支持
          </div>
        </div>
      )}
      
      {!summary && !loading && (
        <div className="text-gray-500 text-sm">
          点击&quot;刷新&quot;按钮，AI将为您分析文章内容并提取关键信息。
        </div>
      )}
    </div>
  );
} 