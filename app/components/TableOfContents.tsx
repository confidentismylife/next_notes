'use client'

import { useEffect, useState } from 'react'

interface TableOfContentsProps {
    toc: string[] | string | any;
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
    const [debugInfo, setDebugInfo] = useState<string>("");
    const [processedToc, setProcessedToc] = useState<string[]>([]);
    
    // 添加调试日志和处理逻辑
    useEffect(() => {
        console.log("TableOfContents 收到的目录数据:", toc);
        console.log("目录数据类型:", typeof toc);
        console.log("目录数据长度:", toc?.length);
        
        if (!toc) {
            setDebugInfo("目录数据为空!");
            setProcessedToc([]);
            return;
        }
        
        if (!Array.isArray(toc)) {
            setDebugInfo("目录数据不是数组!");
            // 尝试将非数组数据转换为数组
            try {
                if (typeof toc === 'string') {
                    // 如果是JSON字符串，尝试解析
                    try {
                        const parsed = JSON.parse(toc);
                        if (Array.isArray(parsed)) {
                            setProcessedToc(parsed);
                            setDebugInfo(`从字符串解析的目录项数量: ${parsed.length}`);
                            return;
                        }
                    } catch (e) {
                        // 如果不是JSON，尝试按行分割
                        const lines = (toc as string).split('\n').filter(Boolean);
                        setProcessedToc(lines);
                        setDebugInfo(`从字符串分割的目录项数量: ${lines.length}`);
                        return;
                    }
                }
                setProcessedToc([]);
            } catch (e) {
                console.error("处理目录数据时出错:", e);
                setProcessedToc([]);
            }
        } else if (toc.length === 0) {
            setDebugInfo("目录数组为空!");
            setProcessedToc([]);
        } else {
            setDebugInfo(`目录项数量: ${toc.length}`);
            setProcessedToc(toc);
        }
    }, [toc]);

    // 处理目录项的点击事件
    const handleClick = (item: string) => {
        // 移除缩进空格
        const cleanItem = item.replace(/^\s+/, '');
        console.log("点击目录项:", cleanItem);
        // 尝试两种ID格式（带破折号或不带）
        let element = document.getElementById(cleanItem.toLowerCase().replace(/\s+/g, '-'));
        if (!element) {
            // 如果找不到带破折号的ID，尝试不带破折号的ID
            element = document.getElementById(cleanItem.toLowerCase().replace(/\s+/g, ''));
        }
        
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn("找不到对应的标题元素:", cleanItem);
            // 遍历所有标题元素尝试匹配
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            console.log("页面上找到的标题元素:", headings.length);
            let found = false;
            headings.forEach(heading => {
                console.log("标题文本:", heading.textContent, "ID:", heading.id);
                if (heading.textContent?.trim().toLowerCase() === cleanItem.toLowerCase()) {
                    heading.scrollIntoView({ behavior: 'smooth' });
                    found = true;
                }
            });
            
            if (!found) {
                console.warn("无法找到匹配的标题元素，目录项可能与标题文本不匹配");
            }
        }
    }

    // 计算每个条目的缩进级别
    const getIndentLevel = (item: string): number => {
        const leadingSpaces = item.match(/^(\s*)/)?.[1].length || 0;
        return Math.floor(leadingSpaces / 2); // 每级缩进是2个空格
    }

    return (
        <div className="sticky top-16 bg-white rounded-xl shadow-sm p-6 mx-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <h3 className="text-xl font-bold mb-4">目录</h3>
            <div className="text-sm text-gray-400 mb-2">{debugInfo}</div>
            <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                {processedToc.length > 0 ? (
                    <ul className="space-y-3">
                        {processedToc.map((item, index) => {
                            if (!item) return null; // 跳过空项
                            
                            const level = getIndentLevel(item);
                            const cleanItem = item.replace(/^\s+/, '');
                            
                            return (
                                <li 
                                    key={index} 
                                    className={`text-gray-700 hover:text-blue-600 cursor-pointer text-base font-medium ${
                                        level > 0 ? 'pl-' + (level * 3) : ''
                                    }`}
                                    onClick={() => handleClick(item)}
                                    style={{ paddingLeft: `${level * 12}px` }}
                                >
                                    {cleanItem}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-base">无目录</p>
                )}
            </nav>
        </div>
    )
} 