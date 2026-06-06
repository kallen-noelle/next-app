"use client"

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon } from "lucide-react"
import { toast } from "sonner"

// 类型定义
interface Task {
  create_time: string
  grade: string
  id: number
  mode: string
  status: string
  subject: string
  task_id: string
  update_time: string
  user_id: number
}

interface Question {
  no: string
  question_text: string
  question_type: string
  student_answer: string
  correction: {
    analysis: string
    comment: string
    result: string
    score: number
  }
}

interface Result {
  create_time: string
  grade: string
  questions: Question[]
  status: string
  subject: string
  task_id: string
}

interface WeekStats {
  totalHomework: number
  totalQuestions: number
}

export function SectionCards() {
  const [weekStats, setWeekStats] = useState<WeekStats>({
    totalHomework: 0,
    totalQuestions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // 获取当前周的开始和结束日期
  const getCurrentWeekRange = () => {
    const today = new Date('2026-06-05') // 当前日期：6月5日星期五
    const dayOfWeek = today.getDay() // 0=周日, 1=周一, ..., 5=周五
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1) // 周一
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (7 - dayOfWeek)) // 周日
    return { startOfWeek, endOfWeek }
  }

  // 判断日期是否在本周内
  const isInCurrentWeek = (dateString: string) => {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange()
    const date = new Date(dateString)
    return date >= startOfWeek && date <= endOfWeek
  }

  // 统计本周总作业数和总题目数
  const calculateWeekStats = (tasks: Task[], results: Result[]) => {
    let totalHomework = 0
    let totalQuestions = 0

    // 统计本周作业数
    tasks.forEach(task => {
      if (isInCurrentWeek(task.create_time)) {
        totalHomework++
      }
    })

    // 统计本周题目数
    results.forEach(result => {
      if (isInCurrentWeek(result.create_time)) {
        totalQuestions += result.questions.length
      }
    })

    return { totalHomework, totalQuestions }
  }

  useEffect(() => {
    const loadWeekStats = async () => {
      try {
        setIsLoading(true)
        
        // 使用模拟数据代替API调用
        // 模拟本周作业数据（周一至周五）
        const mockTasks: Task[] = [
          { create_time: '2026-06-02T10:00:00', grade: '二年级', id: 1, mode: 'aliyun', status: 'completed', subject: '数学', task_id: 'task-001', update_time: '2026-06-02T10:05:00', user_id: 1 },
          { create_time: '2026-06-02T14:30:00', grade: '二年级', id: 2, mode: 'bailian', status: 'completed', subject: '语文', task_id: 'task-002', update_time: '2026-06-02T14:35:00', user_id: 1 },
          { create_time: '2026-06-03T09:15:00', grade: '二年级', id: 3, mode: 'aliyun', status: 'completed', subject: '英语', task_id: 'task-003', update_time: '2026-06-03T09:20:00', user_id: 1 },
          { create_time: '2026-06-03T15:45:00', grade: '二年级', id: 4, mode: 'aliyun', status: 'completed', subject: '数学', task_id: 'task-004', update_time: '2026-06-03T15:50:00', user_id: 1 },
          { create_time: '2026-06-04T11:20:00', grade: '二年级', id: 5, mode: 'bailian', status: 'completed', subject: '语文', task_id: 'task-005', update_time: '2026-06-04T11:25:00', user_id: 1 },
          { create_time: '2026-06-04T16:10:00', grade: '二年级', id: 6, mode: 'aliyun', status: 'completed', subject: '英语', task_id: 'task-006', update_time: '2026-06-04T16:15:00', user_id: 1 },
          { create_time: '2026-06-05T08:30:00', grade: '二年级', id: 7, mode: 'bailian', status: 'completed', subject: '数学', task_id: 'task-007', update_time: '2026-06-05T08:35:00', user_id: 1 },
          { create_time: '2026-06-05T13:25:00', grade: '二年级', id: 8, mode: 'aliyun', status: 'completed', subject: '语文', task_id: 'task-008', update_time: '2026-06-05T13:30:00', user_id: 1 },
          { create_time: '2026-06-05T15:40:00', grade: '二年级', id: 9, mode: 'bailian', status: 'completed', subject: '英语', task_id: 'task-009', update_time: '2026-06-05T15:45:00', user_id: 1 },
        ]

        // 模拟作业结果数据
        const mockResults: Result[] = [
          { create_time: '2026-06-02T10:00:00', grade: '二年级', questions: Array(12).fill({}), status: 'completed', subject: '数学', task_id: 'task-001' },
          { create_time: '2026-06-02T14:30:00', grade: '二年级', questions: Array(8).fill({}), status: 'completed', subject: '语文', task_id: 'task-002' },
          { create_time: '2026-06-03T09:15:00', grade: '二年级', questions: Array(15).fill({}), status: 'completed', subject: '英语', task_id: 'task-003' },
          { create_time: '2026-06-03T15:45:00', grade: '二年级', questions: Array(10).fill({}), status: 'completed', subject: '数学', task_id: 'task-004' },
          { create_time: '2026-06-04T11:20:00', grade: '二年级', questions: Array(9).fill({}), status: 'completed', subject: '语文', task_id: 'task-005' },
          { create_time: '2026-06-04T16:10:00', grade: '二年级', questions: Array(14).fill({}), status: 'completed', subject: '英语', task_id: 'task-006' },
          { create_time: '2026-06-05T08:30:00', grade: '二年级', questions: Array(11).fill({}), status: 'completed', subject: '数学', task_id: 'task-007' },
          { create_time: '2026-06-05T13:25:00', grade: '二年级', questions: Array(7).fill({}), status: 'completed', subject: '语文', task_id: 'task-008' },
          { create_time: '2026-06-05T15:40:00', grade: '二年级', questions: Array(13).fill({}), status: 'completed', subject: '英语', task_id: 'task-009' },
        ]

        // 统计本周数据
        const stats = calculateWeekStats(mockTasks, mockResults)
        setWeekStats(stats)
      } catch (error) {
        console.error('加载周统计数据失败:', error)
        // 初始化默认数据
        setWeekStats({
          totalHomework: 9,
          totalQuestions: 99
        })
      } finally {
        setIsLoading(false)
      }
    };
    loadWeekStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        {[1,2].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>加载中...</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">--</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周总作业数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {weekStats.totalHomework}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {weekStats.totalHomework > 0 ? '+' + weekStats.totalHomework : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            已完成作业
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            平均每天 {weekStats.totalHomework > 0 ? (weekStats.totalHomework / 5).toFixed(1) : 0} 个作业
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>本周总题目数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {weekStats.totalQuestions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {weekStats.totalQuestions > 0 ? '+' + weekStats.totalQuestions : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            题目完成总量
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            平均每天 {weekStats.totalQuestions > 0 ? (weekStats.totalQuestions / 5).toFixed(0) : 0} 道题目
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
