'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload, X, Plus, FileText, Calendar, BookOpen, Users, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { knowledgeApi } from '@/lib/endpoints';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// 知识文档类型定义
interface KnowledgeDocument {
  id: number;
  title: string;
  subject: string;
  grade: string;
  status: string;
  chunk: number;
  create_time: string;
  url: string;
  user_id: number;
}

interface PageResponse {
  total: number;
  rows: KnowledgeDocument[];
}

// 每日统计类型
interface DailyStats {
  day: string;
  documentCount: number;
  chunkCount: number;
}

export default function KnowledgeManagementPage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<KnowledgeDocument | null>(null);
  
  // 上传表单数据
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    subject: '',
    grade: ''
  });

  const router = useRouter();

  // 获取知识文档列表
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await knowledgeApi.getList();
      
      if (response.code === 0) {
        const allDocuments = response.data.rows;
        setDocuments(allDocuments);
        setTotal(allDocuments.length);
        
        // 计算本周每日统计
        const today = new Date();
        const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const stats: DailyStats[] = weekDays.map((day, index) => {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - today.getDay() + 1 + index);
          const dateStr = targetDate.toISOString().split('T')[0];
          
          const dayDocuments = allDocuments.filter(doc => 
            doc.create_time.startsWith(dateStr)
          );
          
          return {
            day,
            documentCount: dayDocuments.length,
            chunkCount: dayDocuments.reduce((sum, doc) => sum + doc.chunk, 0)
          };
        });
        
        setDailyStats(stats);
      } else {
        toast.error(response.message || '获取文档列表失败');
      }
    } catch (error) {
      console.error('获取文档列表错误:', error);
      toast.error('获取文档列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 上传知识文档
  const uploadDocument = async () => {
    if (!uploadData.file) {
      toast.error('请选择要上传的文件');
      return;
    }

    try {
      setUploading(true);
      const result = await knowledgeApi.upload(uploadData.file, uploadData.subject, uploadData.grade);
      
      if (result.code === 0) {
        toast.success('文档上传成功');
        setUploadDialogOpen(false);
        // 重置表单
        setUploadData({
          file: null,
          subject: '',
          grade: ''
        });
        // 刷新文档列表
        fetchDocuments();
      } else {
        toast.error(result.message || '上传文档失败');
      }
    } catch (error) {
      console.error('上传文档错误:', error);
      toast.error('上传文档失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // 删除知识文档
  const deleteDocument = async (id: number) => {
    try {
      const result = await knowledgeApi.delete(id);
      
      if (result.code === 0) {
        toast.success('文档删除成功');
        // 刷新文档列表
        fetchDocuments();
      } else {
        toast.error(result.message || '删除文档失败');
      }
    } catch (error) {
      console.error('删除文档错误:', error);
      toast.error('删除文档失败，请稍后重试');
    }
  };

  // 查看文档
  const viewDocument = async (id: number) => {
    try {
      const result = await knowledgeApi.getDetail(id);
      
      if (result.code === 0) {
        setViewingDocument(result.data);
        setViewDialogOpen(true);
      } else {
        toast.error(result.message || '获取文档详情失败');
      }
    } catch (error) {
      console.error('查看文档错误:', error);
      toast.error('获取文档详情失败，请稍后重试');
    }
  };

  // 页面初始化
  useEffect(() => {
    fetchDocuments(currentPage, pageSize);
  }, []);

  // 分页切换
  const handlePageChange = (page: number) => {
    fetchDocuments(page, pageSize);
  };

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    }
  };

  // 表单输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">知识文档管理</h1>
                  <p className="text-muted-foreground">上传、管理和分享教学知识文档</p>
                </div>
                {/* <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      上传文档
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>上传知识文档</DialogTitle>
                      <DialogDescription>
                        上传教学相关的知识文档，支持PDF、Word等格式
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="file">文档文件 *</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploadData.file && (
                          <p className="text-sm text-muted-foreground mt-2">
                            已选择: {uploadData.file.name}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject">科目</Label>
                        <Select name="subject" value={uploadData.subject} onValueChange={(value) => setUploadData(prev => ({...prev, subject: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择科目" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="语文">语文</SelectItem>
                            <SelectItem value="数学">数学</SelectItem>
                            <SelectItem value="英语">英语</SelectItem>
                            <SelectItem value="物理">物理</SelectItem>
                            <SelectItem value="化学">化学</SelectItem>
                            <SelectItem value="生物">生物</SelectItem>
                            <SelectItem value="历史">历史</SelectItem>
                            <SelectItem value="地理">地理</SelectItem>
                            <SelectItem value="政治">政治</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="grade">年级</Label>
                        <Select name="grade" value={uploadData.grade} onValueChange={(value) => setUploadData(prev => ({...prev, grade: value}))}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择年级" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="一年级">一年级</SelectItem>
                            <SelectItem value="二年级">二年级</SelectItem>
                            <SelectItem value="三年级">三年级</SelectItem>
                            <SelectItem value="四年级">四年级</SelectItem>
                            <SelectItem value="五年级">五年级</SelectItem>
                            <SelectItem value="六年级">六年级</SelectItem>
                            <SelectItem value="七年级">七年级</SelectItem>
                            <SelectItem value="八年级">八年级</SelectItem>
                            <SelectItem value="九年级">九年级</SelectItem>
                            <SelectItem value="高一">高一</SelectItem>
                            <SelectItem value="高二">高二</SelectItem>
                            <SelectItem value="高三">高三</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                        取消
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={uploadDocument}
                        disabled={uploading || !uploadData.file}
                      >
                        {uploading ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            上传中...
                          </>
                        ) : (
                          '上传文档'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog> */}
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>总文档数</CardDescription>
                    <CardTitle className="text-2xl font-bold">{total}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      知识文档
                    </Badge>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>覆盖科目</CardDescription>
                    <CardTitle className="text-2xl font-bold">{new Set(documents.map(d => d.subject)).size}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      学科覆盖
                    </Badge>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>总分块数</CardDescription>
                    <CardTitle className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.chunk, 0)}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      数据块总数
                    </Badge>
                  </CardFooter>
                </Card>
              </div>

              {/* 每日统计图表 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>本周上传统计</CardTitle>
                  <CardDescription>每日上传的文档总数和分块总数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-between gap-4">
                    {dailyStats.map((stat) => (
                      <div key={stat.day} className="flex-1 min-w-[100px] bg-muted rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-2">{stat.day}</div>
                        <div className="text-lg font-bold text-primary">{stat.documentCount} 文档</div>
                        <div className="text-sm text-muted-foreground">{stat.chunkCount} 分块</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 文档列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>文档列表</CardTitle>
                  <CardDescription>
                    共 {total} 个文档，当前显示第 {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} 个
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Spinner className="h-8 w-8 text-blue-600" />
                      <p className="ml-4 text-muted-foreground">加载中...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">暂无文档</h3>
                      <p className="text-muted-foreground mb-6">还没有上传任何知识文档</p>
                      <Button onClick={() => setUploadDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        上传第一个文档
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>文档ID</TableHead>
                            <TableHead>文档名称</TableHead>
                            <TableHead>科目</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>分块数</TableHead>
                            <TableHead>上传时间</TableHead>
                            <TableHead>操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.map(doc => (
                            <TableRow key={doc.id}>
                              <TableCell className="font-medium">
                                {doc.id}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4 text-blue-600" />
                                  <span className="max-w-xs truncate" title={doc.title}>{doc.title}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{doc.subject}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={doc.status === 'completed' ? 'bg-green-100 text-green-800' : doc.status === 'processing' ? 'bg-blue-100 text-blue-800' : doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                                  {doc.status === 'completed' ? '已完成' : doc.status === 'processing' ? '处理中' : doc.status === 'pending' ? '待处理' : doc.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {doc.chunk}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                                  {new Date(doc.create_time).toLocaleString('zh-CN')}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => viewDocument(doc.id)}
                                    className="h-8 px-2"
                                  >
                                    查看
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 px-2"
                                      >
                                        删除
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>确认删除文档</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          确定要删除文档 "{doc.title}" 吗？此操作无法撤销。
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                          onClick={() => deleteDocument(doc.id)}
                                        >
                                          删除
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* 分页 */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          每页显示 {pageSize} 条，共 {total} 条
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            上一页
                          </Button>
                          <span className="text-sm">
                            第 {currentPage} 页 / {Math.ceil(total / pageSize)} 页
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= Math.ceil(total / pageSize)}
                          >
                            下一页
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 查看文档 Dialog */}
              <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>文档详情</DialogTitle>
                    <DialogDescription>
                      {viewingDocument?.title}
                    </DialogDescription>
                  </DialogHeader>
                  {viewingDocument && (
                    <div className="grid gap-4 py-4">
                      {/* 文档信息 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">文档ID</Label>
                          <p className="font-medium">{viewingDocument.id}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">科目</Label>
                          <p className="font-medium">{viewingDocument.subject}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">年级</Label>
                          <p className="font-medium">{viewingDocument.grade}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">状态</Label>
                          <Badge className={viewingDocument.status === 'completed' ? 'bg-green-100 text-green-800' : viewingDocument.status === 'processing' ? 'bg-blue-100 text-blue-800' : viewingDocument.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                            {viewingDocument.status === 'completed' ? '已完成' : viewingDocument.status === 'processing' ? '处理中' : viewingDocument.status === 'pending' ? '待处理' : viewingDocument.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">分块数</Label>
                          <p className="font-medium">{viewingDocument.chunk}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">上传时间</Label>
                          <p className="font-medium">{new Date(viewingDocument.create_time).toLocaleString('zh-CN')}</p>
                        </div>
                      </div>
                      
                      {/* 文档图片 */}
                      <div className="mt-4">
                        <Label className="text-muted-foreground mb-2 block">文档预览</Label>
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <img 
                            src={viewingDocument.url} 
                            alt={viewingDocument.title}
                            className="w-full h-auto max-h-[500px] object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-center text-muted-foreground py-8">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>无法预览此文档</p>
                            <p className="text-sm mt-1">{viewingDocument.url}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                      关闭
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
           </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


