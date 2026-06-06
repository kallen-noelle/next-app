"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GripVerticalIcon, CircleCheckIcon, LoaderIcon, EllipsisVerticalIcon, Columns3Icon, ChevronDownIcon, PlusIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, TrendingUpIcon, ClockIcon, Loader2Icon, XIcon, CircleHelpIcon, FileTextIcon } from "lucide-react"
import { homeworkApi } from "@/lib/endpoints"
export const schema = z.object({
  id: z.number(),
  taskId: z.string(),
  subject: z.string(),
  status: z.string(),
  questionCount: z.number(),
  averageScore: z.number(),
  createTime: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "taskId",
    header: "任务ID",
    cell: ({ row }) => {
      return <span className="font-mono text-sm">{row.original.taskId.slice(0, 5)}</span>
    },
  },
  {
    accessorKey: "subject",
    header: "科目",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2">
        {row.original.subject}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = status;
      let icon = null;
      let className = "px-2";

      switch (status.toLowerCase()) {
        case "pending":
        case "待批改":
          statusText = "待处理";
          icon = <ClockIcon className="size-3" />;
          className += " text-muted-foreground";
          break;
        case "processing":
        case "in process":
        case "in_progress":
          statusText = "处理中";
          icon = <Loader2Icon className="size-3 animate-spin" />;
          className += " text-blue-500 dark:text-blue-400";
          break;
        case "completed":
        case "done":
          statusText = "已完成";
          icon = <CircleCheckIcon className="size-3 fill-green-500 dark:fill-green-400" />;
          className += " text-green-500 dark:text-green-400";
          break;
        case "failed":
        case "error":
          statusText = "失败";
          icon = <XIcon className="size-3 fill-red-500 dark:fill-red-400" />;
          className += " text-red-500 dark:text-red-400";
          break;
        default:
          statusText = status;
          icon = <CircleHelpIcon className="size-3" />;
          className += " text-muted-foreground";
      }

      return (
        <Badge variant="outline" className={className}>
          {icon}
          {statusText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "questionCount",
    header: "题目数",
    cell: ({ row }) => (
      <div className="text-center">{row.original.questionCount}</div>
    ),
  },
  {
    accessorKey: "averageScore",
    header: "平均分",
    cell: ({ row }) => (
      <div className="text-center">{row.original.averageScore.toFixed(1)}</div>
    ),
  },
  {
    accessorKey: "createTime",
    header: "创建时间",
    cell: ({ row }) => {
      const date = new Date(row.original.createTime);
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Props 接口
interface DataTableProps {
  initialData?: z.infer<typeof schema>[]
  loading?: boolean
  error?: string | null
}

export function DataTable({ initialData = [], loading = false, error = null }: DataTableProps) {
  const [data, setData] = React.useState<z.infer<typeof schema>[]>(initialData)
  const [isLoading, setIsLoading] = React.useState(loading)
  const [tableError, setTableError] = React.useState(error)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  // 查看作业 Dialog 状态
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
  const [viewingResult, setViewingResult] = React.useState<any>(null)
  const [viewLoading, setViewLoading] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [hoveredQuestion, setHoveredQuestion] = React.useState<any>(null)
  const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number } | null>(null)
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  
  // 处理查看作业
  const handleView = React.useCallback(async (taskId: string) => {
    setViewLoading(true)
    try {
      const result = await homeworkApi.getResult(taskId)
      if (result.code === 0) {
        setViewingResult(result.data)
        setViewDialogOpen(true)
      } else {
        toast.error(result.message || '获取作业详情失败')
      }
    } catch (error) {
      console.error('获取作业详情失败:', error)
      toast.error('获取作业详情失败，请稍后重试')
    } finally {
      setViewLoading(false)
    }
  }, [])
  
  // 处理删除作业
  const handleDelete = React.useCallback(async (taskId: string) => {
    try {
      const result = await homeworkApi.delete(taskId)
      if (result.code === 0) {
        toast.success('删除成功')
        // 从数据中移除
        setData(prev => prev.filter(item => item.taskId !== taskId))
      } else {
        toast.error(result.message || '删除失败')
      }
    } catch (error) {
      console.error('删除作业失败:', error)
      toast.error('删除失败，请稍后重试')
    }
  }, [])
  
  // 处理鼠标移动
  const handleMouseMove = React.useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    imgIndex: number
  ) => {
    if (!viewingResult || !imageDimensions) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 转换为百分比
    const xPercent = x / rect.width
    const yPercent = y / rect.height
    
    setMousePosition({ x: e.clientX, y: e.clientY })
    
    // 检查鼠标是否在任何 block 区域内
    const questions = viewingResult.questions || []
    for (const q of questions) {
      const blocks = q.blocks || []
      for (const block of blocks) {
        if (block.url.includes(imgIndex.toString()) || block.url === viewingResult.images[imgIndex]?.url) {
          if (
            xPercent >= block.x1 &&
            xPercent <= block.x2 &&
            yPercent >= block.y1 &&
            yPercent <= block.y2
          ) {
            setHoveredQuestion(q)
            return
          }
        }
      }
    }
    
    setHoveredQuestion(null)
  }, [viewingResult, imageDimensions])
  
  // 处理鼠标离开
  const handleMouseLeave = React.useCallback(() => {
    setHoveredQuestion(null)
    setImageDimensions(null)
  }, [])
  
  // 列定义（移到内部以使用回调）
  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      accessorKey: "taskId",
      header: "任务ID",
      cell: ({ row }) => {
        return <span className="font-mono text-sm">{row.original.taskId.slice(0, 5)}</span>
      },
    },
    {
      accessorKey: "subject",
      header: "科目",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-2">
          {row.original.subject}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.original.status;
        let statusText = status;
        let icon = null;
        let className = "px-2";

        switch (status.toLowerCase()) {
          case "pending":
          case "待批改":
            statusText = "待处理";
            icon = <ClockIcon className="size-3" />;
            className += " text-muted-foreground";
            break;
          case "processing":
          case "in process":
          case "in_progress":
            statusText = "处理中";
            icon = <Loader2Icon className="size-3 animate-spin" />;
            className += " text-blue-500 dark:text-blue-400";
            break;
          case "completed":
          case "done":
            statusText = "已完成";
            icon = <CircleCheckIcon className="size-3 fill-green-500 dark:fill-green-400" />;
            className += " text-green-500 dark:text-green-400";
            break;
          case "failed":
          case "error":
            statusText = "失败";
            icon = <XIcon className="size-3 fill-red-500 dark:fill-red-400" />;
            className += " text-red-500 dark:text-red-400";
            break;
          default:
            statusText = status;
            icon = <CircleHelpIcon className="size-3" />;
            className += " text-muted-foreground";
        }

        return (
          <Badge variant="outline" className={className}>
            {icon}
            {statusText}
          </Badge>
        );
      },
    },
    {
      accessorKey: "questionCount",
      header: "题目数",
      cell: ({ row }) => (
        <div className="text-center">{row.original.questionCount}</div>
      ),
    },
    {
      accessorKey: "averageScore",
      header: "平均分",
      cell: ({ row }) => (
        <div className="text-center">{row.original.averageScore.toFixed(1)}</div>
      ),
    },
    {
      accessorKey: "createTime",
      header: "创建时间",
      cell: ({ row }) => {
        const date = new Date(row.original.createTime);
        return date.toLocaleDateString('zh-CN', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
    },
    {
      accessorKey: "actions",
      header: "操作",
      cell: ({row}) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]"
              size="icon"
              >
              <EllipsisVerticalIcon/>
              <span className="sr-only">Open menu</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleView(row.original.taskId)}>
              查看
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(row.original.taskId)}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // 当 props 变化时更新数据和状态
  React.useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData)
      setPagination({ pageIndex: 0, pageSize: 10 })
    }
  }, [initialData])

  // 监听 loading 和 error 属性变化
  React.useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  React.useEffect(() => {
    setTableError(error)
  }, [error])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <PlusIcon
            />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {
                isLoading ?
                      (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              <p className="text-sm text-muted-foreground">加载中...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) 
                :
                    error ?
                          (
                            <TableRow>
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-sm text-red-500">{error}</p>
                                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                    重试
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            ) 
                      : 
                          table.getRowModel().rows?.length ?
                           (
                            <SortableContext
                              items={dataIds}
                              strategy={verticalListSortingStrategy}
                            >
                              {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} />
                              ))}
                            </SortableContext>
                          ) 
                          : 
                            (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                              >
                                暂无数据
                              </TableCell>
                            </TableRow>
                          )
                }
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon
                />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon
                />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon
                />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      
      {/* 查看作业 Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>作业详情</DialogTitle>
            <DialogDescription>
              {viewingResult && (
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{viewingResult.subject}</Badge>
                  <Badge variant="outline">{viewingResult.grade}</Badge>
                  <span className="text-sm text-muted-foreground">
                    创建时间: {new Date(viewingResult.create_time).toLocaleString('zh-CN')}
                  </span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {viewLoading ? (
            <div className="flex justify-center py-8">
              <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewingResult ? (
            <div className="space-y-6">
              {/* 作业图片展示 */}
              {viewingResult.images && viewingResult.images.length > 0 ? (
                <div className="relative">
                  <div className="grid gap-4">
                    {viewingResult.images.map((img: any, index: number) => (
                      <div 
                        key={index} 
                        className="rounded-lg border overflow-hidden relative"
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <img 
                          ref={(el) => {
                            if (el && !imageDimensions) {
                              el.onload = () => {
                                setImageDimensions({
                                  width: el.naturalWidth,
                                  height: el.naturalHeight
                                })
                              }
                            }
                          }}
                          src={img.url} 
                          alt={`作业图片 ${index + 1}`}
                          className="w-full h-auto object-contain max-h-[500px] cursor-crosshair"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden text-center text-muted-foreground py-8">
                          <FileTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>无法预览此图片</p>
                          <p className="text-sm mt-1">{img.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 题目详情跟随框 */}
                  {hoveredQuestion && (
                    <div 
                      className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-xl border p-4 max-w-sm"
                      style={{
                        left: `${mousePosition.x + 15}px`,
                        top: `${mousePosition.y + 15}px`,
                        pointerEvents: 'none'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm">
                          第 {hoveredQuestion.no || 1} 题
                        </span>
                        {hoveredQuestion.correction && (
                          <Badge className={hoveredQuestion.correction.result === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {hoveredQuestion.correction.score} 分
                          </Badge>
                        )}
                      </div>
                      {hoveredQuestion.question_type && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          {hoveredQuestion.question_type}
                        </Badge>
                      )}
                      {hoveredQuestion.question_text && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {hoveredQuestion.question_text}
                        </p>
                      )}
                      {hoveredQuestion.student_answer && (
                        <p className="text-sm mb-2">
                          <span className="font-medium">学生答案:</span> {hoveredQuestion.student_answer}
                        </p>
                      )}
                      {hoveredQuestion.correction && (
                        <div className="text-sm space-y-1 border-t pt-2">
                          <p className="font-medium">批改结果</p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">评价:</span> {hoveredQuestion.correction.comment}
                          </p>
                          {hoveredQuestion.correction.analysis && (
                            <p className="text-muted-foreground">
                              <span className="font-medium">分析:</span> {hoveredQuestion.correction.analysis}
                            </p>
                          )}
                          {hoveredQuestion.knowledge_refs && hoveredQuestion.knowledge_refs.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="font-medium text-xs mb-1">相关知识点:</p>
                              {hoveredQuestion.knowledge_refs.map((ref: any, i: number) => (
                                <div key={i} className="text-xs text-muted-foreground">
                                  <p className="font-medium">{ref.title}</p>
                                  <p>{ref.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>暂无作业图片</p>
                </div>
              )}
            </div>
          ) : null}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.subject}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem value="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem value="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.score} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="average">Average</Label>
                <Input id="average" defaultValue={item.average} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.date}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Jamik Tashpulatov">
                      Jamik Tashpulatov
                    </SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
