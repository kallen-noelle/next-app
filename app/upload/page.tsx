"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { homeworkApi, knowledgeApi } from '@/lib/endpoints';

import { toast } from 'sonner';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
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
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = localStorage.getItem('user_id');
  
  // 获取用户角色
  const userRole = localStorage.getItem('role') || 'student';
  
  // 根据角色设置默认上传类型
  const uploadType = userRole === 'teacher' ? 'knowledge' : 'homework';
  
  const subjects = [
    { value: 'math', label: '数学' },
    { value: 'english', label: '英语' },
    { value: 'chinese', label: '语文' },
    { value: 'physics', label: '物理' },
    { value: 'chemistry', label: '化学' },
    { value: 'biology', label: '生物' },
    { value: 'history', label: '历史' },
    { value: 'geography', label: '地理' },
    { value: 'politics', label: '政治' },
  ];
  
  const grades = [
    { value: 'grade1', label: '一年级' },
    { value: 'grade2', label: '二年级' },
    { value: 'grade3', label: '三年级' },
    { value: 'grade4', label: '四年级' },
    { value: 'grade5', label: '五年级' },
    { value: 'grade6', label: '六年级' },
    { value: 'grade7', label: '七年级' },
    { value: 'grade8', label: '八年级' },
    { value: 'grade9', label: '九年级' },
    { value: 'grade10', label: '十年级' },
    { value: 'grade11', label: '十一年级' },
    { value: 'grade12', label: '十二年级' },
  ];
  
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
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

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
    setShowErrors(true);

    let isValid = true;

    if (!file) {
      toast.error('请选择文件');
      isValid = false;
    }

    if (!grade) {
      isValid = false;
    }

    if (!subject) {
      isValid = false;
    }

    if (!userId) {
      toast.error('用户未登录');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsUploading(true);

    try {
      if (uploadType === 'homework') {
        await homeworkApi.upload(file!, subject, grade);
        toast.success('作业上传成功');
      } else {
        await knowledgeApi.upload(file!, subject, grade);
        toast.success('知识文档上传成功');
      }

      // 重置表单
      setFile(null);
      setGrade('');
      setSubject('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  return (

      <div className="max-w-3xl mx-auto ">
     

        <form onSubmit={handleSubmit} className="space-y-6">
      
          <div className="grid grid-cols-2 gap-4">
            <Field>
               <FieldLabel htmlFor="form-grade">年级</FieldLabel>
              <Select 
                value={grade} 
                onValueChange={setGrade}
                required
              >
                <SelectTrigger id="form-grade">
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showErrors && !grade && (
                 <p className="text-sm text-red-500 mt-1">请选择年级</p>
               )}
            </Field>
            <Field>
               <FieldLabel htmlFor="form-subject">科目</FieldLabel>
               <Select 
                 value={subject} 
                 onValueChange={setSubject}
                 required
                 
               >
                 <SelectTrigger id="form-subject">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {subjects.map((subject) => (
                     <SelectItem key={subject.value} value={subject.value}>
                       {subject.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               {showErrors && !subject && (
                  <p className="text-sm text-red-500 mt-1">请选择科目</p>
                )}
            </Field>
            {/* 显示当前上传类型（根据角色自动决定） */}
            <div className="flex items-end">
              <div className="bg-muted rounded-lg px-3 py-2">
                <span className="text-sm text-muted-foreground">上传类型:</span>
                <span className="ml-2 font-medium">
                  {uploadType === 'homework' ? '作业' : '知识文档'}
                </span>
              </div>
            </div>
         </div>

          <div className="bg-muted rounded-xl shadow-sm p-6 border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              上传文件
            </label>

            {!file ?
             (
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
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${   isDragging ? 'text-blue-500' : 'text-gray-400'
                      }`}/>
                    <p className="text-gray-600 font-medium">   拖拽文件到此处，或点击选择文件 </p>
                    <p className="text-sm text-gray-500 mt-2">  支持 PDF, DOC, DOCX, TXT, ZIP, RAR 格式</p>
                </div>
            ) 
            : 
            (
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
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors" >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full py-3 px-4 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isUploading ? '上传中...' : (uploadType === 'homework' ? '提交作业' : '上传知识文档')}
          </button>
        </form>
      </div>
  )
}
