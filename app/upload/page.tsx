"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { homeworkApi } from '@/lib/endpoints';
import { toast } from 'sonner';
import { Upload, File, X, Loader2 } from 'lucide-react';
export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <EmptyOutline />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function EmptyOutline() {
    const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('请选择文件');
      return;
    }

    if (!title.trim()) {
      toast.error('请输入作业标题');
      return;
    }

    setIsUploading(true);

    try {
      await homeworkApi.upload(file, title, description);
      toast.success('作业上传成功');
      router.push('/homework');
    } catch {
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  return (

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">上传作业</h1>
          <p className="text-gray-600 mt-1">提交您的作业文件进行批改</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作业标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="请输入作业标题"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作业描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="请输入作业描述..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              上传文件
            </label>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                />
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    isDragging ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <p className="text-gray-600 font-medium">
                  拖拽文件到此处，或点击选择文件
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  支持 PDF, DOC, DOCX, TXT, ZIP, RAR 格式
                </p>
              </div>
            ) : (
              <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <File className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isUploading ? '上传中...' : '提交作业'}
          </button>
        </form>
      </div>
  )
}
