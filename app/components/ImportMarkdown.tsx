'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMarkdown } from '../actions/uploadMarkdown'

// 设置固定密码 - 更改为更复杂的密码
const UPLOAD_PASSWORD = '111111'
const MAX_ATTEMPTS = 3 // 最大尝试次数

export default function ImportMarkdown() {
    const [isUploading, setIsUploading] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [password, setPassword] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [attempts, setAttempts] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLocked, setIsLocked] = useState(false)
    const [lockCountdown, setLockCountdown] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // 处理锁定倒计时
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        
        if (isLocked && lockCountdown > 0) {
            timer = setInterval(() => {
                setLockCountdown(prev => prev - 1);
            }, 1000);
        } else if (isLocked && lockCountdown === 0) {
            setIsLocked(false);
            setAttempts(0);
        }
        
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isLocked, lockCountdown]);

    // 显示密码输入框
    const handleImportClick = () => {
        setShowPasswordDialog(true);
        setPassword('');
        setErrorMessage('');
    }

    // 处理密码验证
    const handlePasswordVerify = () => {
        if (isLocked) return;
        
        if (password !== UPLOAD_PASSWORD) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            if (newAttempts >= MAX_ATTEMPTS) {
                setIsLocked(true);
                setLockCountdown(60); // 锁定60秒
                setErrorMessage(`密码错误次数过多，请在 ${lockCountdown} 秒后重试`);
            } else {
                setErrorMessage(`密码错误，还剩 ${MAX_ATTEMPTS - newAttempts} 次尝试机会`);
            }
            return;
        }
        
        // 密码正确，关闭密码对话框，打开文件选择器
        setShowPasswordDialog(false);
        setAttempts(0);
        setErrorMessage('');
        
        // 触发文件选择
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        // 检查文件类型
        if (!file.name.toLowerCase().endsWith('.md')) {
            alert('请选择 Markdown (.md) 文件')
            return
        }

        // 检查文件大小（限制为 10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小不能超过 10MB')
            return
        }

        setSelectedFile(file)
        handleUpload(file)
    }

    const handleUpload = async (file: File) => {
        if (isUploading) return
        
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadMarkdown(formData)

            if (result.success) {
                alert(`文件上传成功！\n保存为: ${result.fileName}`)
                router.refresh()
                // 重置状态
                setPassword('')
                setSelectedFile(null)
                setAttempts(0)
                setErrorMessage('')
            } else {
                throw new Error(result.error || '上传失败')
            }
        } catch (error) {
            console.error('上传失败:', error)
            alert('上传失败，请重试')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                {/* 隐藏的文件输入框 */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading || isLocked}
                />
                
                {/* 可见的导入按钮 */}
                <button
                    onClick={handleImportClick}
                    disabled={isUploading || isLocked}
                    className={`
                        flex items-center gap-2 px-6 py-3
                        bg-blue-600 hover:bg-blue-700
                        text-white rounded-full shadow-xl
                        cursor-pointer transition-all duration-200
                        transform hover:scale-105
                        ${(isUploading || isLocked) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium">
                        {isUploading ? '上传中...' : isLocked ? `已锁定 (${lockCountdown}s)` : '导入 Markdown'}
                    </span>
                </button>
            </div>

            {/* 密码输入对话框 */}
            {showPasswordDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-xl font-semibold mb-4">请输入上传密码</h3>
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errorMessage ? 'border-red-500' : ''}`}
                                placeholder="请输入密码"
                                autoFocus
                                disabled={isLocked}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isLocked) {
                                        e.preventDefault()
                                        handlePasswordVerify()
                                    }
                                }}
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-1">{isLocked ? `密码错误次数过多，请在 ${lockCountdown} 秒后重试` : errorMessage}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordDialog(false)
                                    setPassword('')
                                    setErrorMessage('')
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                取消
                            </button>
                            <button
                                onClick={handlePasswordVerify}
                                disabled={isUploading || isLocked}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLocked ? `已锁定 (${lockCountdown}s)` : '确认'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 