"use client"

import { useState, useEffect } from 'react'
import { homeworkApi } from '@/lib/endpoints'

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
  blocks: any[]
  correction: {
    analysis: string
    comment: string
    result: string
    score: number
  } | null
  create_time: string
  knowledge_refs: any[]
  no: string
  question_text: string
  question_type: string
  student_answer: string
}

interface HomeworkResult {
  create_time: string
  grade: string
  questions: Question[]
  status: string
  subject: string
  task_id: string
}

interface TableData {
  id: number
  taskId: string
  subject: string
  status: string
  questionCount: number
  averageScore: number
  createTime: string
}

interface ChartDataItem {
  day: string
  homeworkCount: number
  questionCount: number
}

export function useHomeworkData() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [results, setResults] = useState<Map<string, HomeworkResult>>(new Map())
  const [tableData, setTableData] = useState<TableData[]>([])
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 计算统计数据
  const statisticsData = (tasks: Task[], resultsMap: Map<string, HomeworkResult>) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const stats: Record<string, { homeworkCount: number; questionCount: number }> = {}
    
    // 初始化本周所有天数为0
    weekDays.forEach(day => {
      stats[day] = { homeworkCount: 0, questionCount: 0 }
    })

    // 获取当前周的开始和结束日期
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1)
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (7 - dayOfWeek))

    // 判断日期是否在本周内
    const isInCurrentWeek = (dateString: string) => {
      const date = new Date(dateString)
      return date >= startOfWeek && date <= endOfWeek
    }

    // 获取星期几的英文名称
    const getDayName = (dateString: string) => {
      const date = new Date(dateString)
      const dayIndex = date.getDay()
      return weekDays[dayIndex === 0 ? 6 : dayIndex - 1]
    }

    // 统计作业数
    tasks.forEach(task => {
      if (isInCurrentWeek(task.create_time)) {
        const dayName = getDayName(task.create_time)
        if (stats[dayName]) {
          stats[dayName].homeworkCount++
        }
      }
    })

    // 统计题目数
    resultsMap.forEach((result) => {
      if (isInCurrentWeek(result.create_time)) {
        const dayName = getDayName(result.create_time)
        if (stats[dayName]) {
          stats[dayName].questionCount += result.questions.length
        }
      }
    })

    // 转换为图表数据格式
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
    
    const chartData: ChartDataItem[] = weekDays.map((day, index) => {
      if ((day === 'Saturday' || day === 'Sunday') && index > todayIndex) {
        return { day, homeworkCount: 0, questionCount: 0 }
      }
      return {
        day,
        homeworkCount: stats[day]?.homeworkCount || 0,
        questionCount: stats[day]?.questionCount || 0,
      }
    })

    return chartData
  }

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 第一步：获取所有任务列表
      const tasksResponse = await homeworkApi.getList()
      const fetchedTasks: Task[] = tasksResponse.data.rows
      setTasks(fetchedTasks)
      
      // 第二步：对每个任务获取批改结果
      const resultsMap = new Map<string, HomeworkResult>()
      
      await Promise.all(fetchedTasks.map(async (task) => {
        try {
          const resultResponse = await homeworkApi.getHomework(task.task_id)
          resultsMap.set(task.task_id, {
            create_time: task.create_time,
            grade: task.grade,
            questions: resultResponse.data.questions || [],
            status: task.status,
            subject: task.subject,
            task_id: task.task_id,
          })
        } catch (e) {
          resultsMap.set(task.task_id, {
            create_time: task.create_time,
            grade: task.grade,
            questions: [],
            status: task.status,
            subject: task.subject,
            task_id: task.task_id,
          })
        }
      }))

      setResults(resultsMap)
      
      // 第三步：构建表格数据
      const tableData: TableData[] = fetchedTasks.map((task) => {
        const result = resultsMap.get(task.task_id)
        const questions = result?.questions || []
        
        let questionCount = questions.length
        let totalScore = 0
        let validQuestionCount = 0
        
        // 计算平均分（跳过correction为空的题目）
        questions.forEach((q) => {
          if (q.correction && q.correction.score !== undefined) {
            totalScore += q.correction.score
            validQuestionCount++
          }
        })
        
        const averageScore = validQuestionCount > 0 ? totalScore / validQuestionCount : 0
        
        return {
          id: task.id,
          taskId: task.task_id,
          subject: task.subject,
          status: task.status,
          questionCount,
          averageScore,
          createTime: task.create_time,
        }
      })
      
      setTableData(tableData)
      
      // 第四步：计算统计数据
      const chartData = statisticsData(fetchedTasks, resultsMap)
      setChartData(chartData)
      
      setError(null)
    } catch (err) {
      console.error('获取数据失败:', err)
      setError('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    tasks,
    results,
    tableData,
    chartData,
    loading,
    error,
    refetch: fetchData,
  }
}
