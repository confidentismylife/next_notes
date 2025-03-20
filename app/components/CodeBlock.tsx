'use client'

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useEffect, useRef } from 'react'

// 预注册常用语言
const LANGUAGES = {
  jsx: () => import('react-syntax-highlighter/dist/cjs/languages/prism/jsx'),
  typescript: () => import('react-syntax-highlighter/dist/cjs/languages/prism/typescript'),
  javascript: () => import('react-syntax-highlighter/dist/cjs/languages/prism/javascript'),
  css: () => import('react-syntax-highlighter/dist/cjs/languages/prism/css'),
  markdown: () => import('react-syntax-highlighter/dist/cjs/languages/prism/markdown')
}

// 检测是否是API表格或一般表格
function isAPITable(content: string): boolean {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length < 3) return false

  // 检查表格基本结构
  const hasTableRows = lines.filter(line => line.includes('|')).length >= 3
  const hasHeaderSeparator = lines.some(line => /\|\s*[-:]+\s*\|/.test(line))

  // 检查特殊情况：是否是API表格的单个单元格值
  const isPartOfTable = lines.length === 1 && content.trim().startsWith('|') && content.trim().endsWith('|')

  // 更宽松的API表格检测
  return hasTableRows && hasHeaderSeparator || isPartOfTable
}

// 改进表格解析逻辑
function parseTableContent(content: string): { headers: string[], rows: string[][] } {
  const lines = content.split('\n').filter(line => line.trim())
  
  // 找到标题行和分隔行
  let headerIndex = -1;
  let separatorIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (/\|\s*[-:]+\s*\|/.test(lines[i])) {
      separatorIndex = i;
      headerIndex = Math.max(0, i - 1);
      break;
    }
  }
  
  if (headerIndex < 0 || separatorIndex < 0) {
    // 兜底处理：如果找不到分隔行，默认第一行为标题
    headerIndex = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].includes('|')) {
        separatorIndex = i;
        break;
      }
    }
    // 仍然找不到分隔行，则设为第二行
    if (separatorIndex < 0) separatorIndex = 1;
  }
  
  // 提取标题
  const headerLine = lines[headerIndex];
  const headers = headerLine
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell !== '');
  
  // 提取数据行
  const dataRows: string[][] = [];
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    if (!lines[i].includes('|')) continue;
    
    // 将一行拆分为单元格
    let cells = lines[i]
      .split('|')
      .map(cell => cell.trim());
    
    // 移除首尾空单元格（由于表格语法以|开头和结尾导致）
    if (cells[0] === '') cells.shift();
    if (cells[cells.length - 1] === '') cells.pop();
    
    // 确保单元格数量与标题一致
    if (cells.length > headers.length) {
      cells = cells.slice(0, headers.length);
    } else {
      while (cells.length < headers.length) {
        cells.push('');
      }
    }
    
    dataRows.push(cells);
  }
  
  return { headers, rows: dataRows };
}

// 检测每列的类型
function detectColumnTypes(rows: string[][], headers: string[]): string[] {
  const columnTypes: string[] = []
  
  headers.forEach((header, index) => {
    const headerLower = header.toLowerCase()
    
    // 基于表头名称识别列类型
    if (/^(参数|param|name|属性|prop|property)$/i.test(headerLower)) {
      columnTypes[index] = 'param'
    }
    else if (/^(类型|type)$/i.test(headerLower)) {
      columnTypes[index] = 'type'
    }
    else if (/^(默认值|default)$/i.test(headerLower)) {
      columnTypes[index] = 'default'
    }
    else if (/^(说明|描述|desc|description)$/i.test(headerLower)) {
      columnTypes[index] = 'description'
    }
    else {
      // 如果无法通过表头识别，尝试通过内容判断
      const columnContent = rows.map(row => row[index]).join(' ')
      
      if (isTypeContent(columnContent)) {
        columnTypes[index] = 'type'
      } else if (isParameterContent(columnContent)) {
        columnTypes[index] = 'param'
      } else if (isDefaultContent(columnContent)) {
        columnTypes[index] = 'default'
      } else {
        columnTypes[index] = 'description'
      }
    }
  })
  
  return columnTypes
}

// 类型内容检测 - 扩展正则表达式以涵盖更多类型
function isTypeContent(content: string): boolean {
  return /(string|number|boolean|object|array|function|\{\}|\[\]|React|<|>|\|)/i.test(content) || 
    /(interface|type|extends|Record|any|void|null|undefined)/.test(content) ||
    /^(true|false)$/.test(content) // 布尔值也视为类型
}

// 参数内容检测
function isParameterContent(content: string): boolean {
  return /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$/.test(content) ||
    /^[a-zA-Z][a-zA-Z0-9]*([A-Z][a-zA-Z0-9]*)*$/.test(content)
}

// 默认值内容检测
function isDefaultContent(content: string): boolean {
  return /^(true|false|null|undefined|\[\]|\{\}|0|1|''|""|``)/.test(content) ||
    /^['"`].*['"`]$/.test(content)
}

// 格式化类型单元格
function formatTypeCell(cell: string): string {
  const formatted = formatSpecialChars(cell)
  return `<span class="type">${formatted}</span>`
}

// 格式化描述单元格，保留换行和特殊格式
function formatDescription(cell: string): string {
  return formatSpecialChars(cell)
    .replace(/`([^`]+)`/g, '<code>$1</code>') // 内联代码
    .replace(/\n/g, '<br>') // 换行
}

// 处理特殊字符
function formatSpecialChars(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}


export default function CodeBlock({ className, children, inline, ...props }: any) {
  const tableRef = useRef<HTMLTableElement>(null)
  const content = String(children).trim()
  const langMatch = /language-(\w+)/.exec(className || '')
  const language = langMatch?.[1] || 'text'
  
  // 调试代码
  console.log('CodeBlock渲染:', { 
    className, 
    langMatch, 
    language,
    contentStart: content.substring(0, 30),
    contentLength: content.length
  })
  
  // 判断各种内容类型
  const isTypeValue = !langMatch && (
    // 常见React和JS类型
    /^(boolean|string|number|object|array|function|ReactNode|Element|ReactElement|FC|Component|JSX\.Element|Promise|void|any)$/.test(content.trim()) ||
    // 布尔值、null和undefined
    /^(true|false|null|undefined)$/.test(content.trim()) ||
    // 泛型和复杂类型
    /^[A-Z][\w]*(<.*>)?$/.test(content.trim()) ||
    // 联合类型和交叉类型
    content.includes('|') && !content.trim().startsWith('|') && !content.trim().endsWith('|')
  )
  
  const isTableRow = !langMatch && 
    content.trim().startsWith('|') && 
    content.trim().endsWith('|') &&
    content.split('\n').length === 1 &&
    !content.includes('---')
  
  const isApiTableContent = isAPITable(content) && !langMatch
  
  // 对于API表格的格式化处理 - useEffect必须在条件渲染之前
  useEffect(() => {
    if (isApiTableContent && tableRef.current) {
      // 将Markdown表格转换为HTML表格
      const formatAPITable = () => {
        const table = tableRef.current
        if (!table) return
        
        // 添加类名但保留元素结构
        table.className = 'api-table'
        
        // 解析表格内容
        const { headers, rows } = parseTableContent(content)
        
        // 清空原表格内容
        while (table.firstChild) {
          table.removeChild(table.firstChild)
        }
        
        // 创建表头
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        
        // 处理表头
        headers.forEach(cell => {
          const th = document.createElement('th')
          th.textContent = cell
          headerRow.appendChild(th)
        })
        
        thead.appendChild(headerRow)
        table.appendChild(thead)
        
        // 创建表体
        const tbody = document.createElement('tbody')
        
        // 自动检测列类型
        const columnTypes = detectColumnTypes(rows, headers)
        
        // 处理数据行
        rows.forEach(rowCells => {
          const tr = document.createElement('tr')
          
          rowCells.forEach((cell, index) => {
            const td = document.createElement('td')
            
            const colType = columnTypes[index]
            
            if (colType === 'type') {
              // 类型单元格
              td.innerHTML = formatTypeCell(cell)
            } else if (colType === 'param') {
              // 参数名列
              td.innerHTML = `<span class="param">${formatSpecialChars(cell)}</span>`
            } else if (colType === 'default') {
              // 默认值
              td.innerHTML = `<span class="default-value">${formatSpecialChars(cell)}</span>`
            } else {
              // 普通描述
              td.innerHTML = formatDescription(cell)
            }
            
            tr.appendChild(td)
          })
          
          tbody.appendChild(tr)
        })
        
        table.appendChild(tbody)
      }
      
      formatAPITable()
    }
  }, [content, isApiTableContent])
  
  // 内联代码不使用SyntaxHighlighter
  if (inline) {
    return <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-500" {...props}>{children}</code>;
  }
  
  // 如果是类型值，直接使用type样式渲染
  if (isTypeValue) {
    return <span className="type">{content}</span>
  }
  
  // 如果是单行表格，使用普通文本渲染
  if (isTableRow) {
    return (
      <div className="api-table-row my-1">
        {content}
      </div>
    )
  }
  
  // API表格渲染
  if (isApiTableContent) {
    return (
      <div className="table-container">
        <table ref={tableRef} className="api-table">
          <tbody>
            <tr>
              <td>
                <code className="hidden">{content}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // 如果包含表格相关内容但不是API表格，使用pre标签
  if (content.includes('|') && content.includes('---') && !langMatch) {
    return (
      <pre className="p-4 text-sm overflow-x-auto my-4 bg-gray-50 rounded-lg border border-gray-200">
        {content}
      </pre>
    )
  }

  // 动态加载语言支持
  if (LANGUAGES[language as keyof typeof LANGUAGES]) {
    LANGUAGES[language as keyof typeof LANGUAGES]()
  }

  // 使用code标签而不是div
  return (
    <SyntaxHighlighter
      language={language}
      style={tomorrow}
      PreTag="pre" 
      CodeTag="code"
      customStyle={{ 
        margin: 0, 
        borderRadius: '0.5rem',
        backgroundColor: '#1e293b', // 强制使用深色背景 
        color: '#e2e8f0'  // 强制使用浅色文本
      }}
      className="rounded-lg my-4 text-sm"
      showLineNumbers
    >
      {content}
    </SyntaxHighlighter>
  )
}