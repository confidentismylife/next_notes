'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMarkdown } from '../actions/uploadMarkdown'

// 设置固定密码
const UPLOAD_PASSWORD = '123456'

export default function ImportMarkdown() {
    const [isUploading, setIsUploading] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [password, setPassword] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const router = useRouter()

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
        setShowPasswordDialog(true)
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        
        if (password !== UPLOAD_PASSWORD) {
            alert('密码错误')
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            const result = await uploadMarkdown(formData)

            if (result.success) {
                alert(`文件上传成功！\n保存为: ${result.fileName}`)
                router.refresh()
                // 重置状态
                setShowPasswordDialog(false)
                setPassword('')
                setSelectedFile(null)
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
                <label className="relative group">
                    <input
                        type="file"
                        accept=".md"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <div className={`
                        flex items-center gap-2 px-6 py-3
                        bg-blue-600 hover:bg-blue-700
                        text-white rounded-full shadow-xl
                        cursor-pointer transition-all duration-200
                        transform hover:scale-105
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base font-medium">
                            {isUploading ? '上传中...' : '导入 Markdown'}
                        </span>
                    </div>
                </label>
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
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="请输入密码"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleUpload()
                                    }
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordDialog(false)
                                    setPassword('')
                                    setSelectedFile(null)
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUploading ? '上传中...' : '确认'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 