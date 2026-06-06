"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

// 类型定义
interface ChartDataItem {
  day: string
  homeworkCount: number
  questionCount: number
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const chartConfig = {
  homeworkCount: {
    label: "当天作业数",
    color: "var(--chart-1)",
  },
  questionCount: {
    label: "当天题目总数",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Props 接口
interface ChartBarMultipleProps {
  chartData?: ChartDataItem[]
  loading?: boolean
}

export function ChartBarMultiple({ chartData = [], loading = false }: ChartBarMultipleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>作业统计图表</CardTitle>
        <CardDescription>本周作业完成情况</CardDescription>
      </CardHeader>
      <CardContent className="aspect-video/1.5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="homeworkCount" fill="var(--color-homeworkCount)" radius={4} />
              <Bar dataKey="questionCount" fill="var(--color-questionCount)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          本周作业完成趋势 <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          显示本周每天的作业数量和题目数量
        </div>
      </CardFooter>
    </Card>
  )
}
