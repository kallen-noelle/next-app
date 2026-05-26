"use client"
//代码272-285
//颜色130-140stroke="var(--color-mobile)"    color: "var(--primary)",
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
 
  
  { date: "2024-05-11", average: 335, score: 270 },
  { date: "2024-05-12", average: 197, score: 240 },
  { date: "2024-05-13", average: 197, score: 160 },
  { date: "2024-05-14", average: 448, score: 490 },
  { date: "2024-05-15", average: 473, score: 380 },
  { date: "2024-05-16", average: 338, score: 400 },
  { date: "2024-05-17", average: 499, score: 420 },
  { date: "2024-05-18", average: 315, score: 350 },
  { date: "2024-05-19", average: 235, score: 180 },
  { date: "2024-05-20", average: 177, score: 230 },
  { date: "2024-05-21", average: 82, score: 140 },
  { date: "2024-05-22", average: 81, score: 120 },
  { date: "2024-05-23", average: 252, score: 290 },
  { date: "2024-05-24", average: 294, score: 220 },
  { date: "2024-05-25", average: 201, score: 250 },
  { date: "2024-05-26", average: 213, score: 170 },
  { date: "2024-05-27", average: 420, score: 460 },
  { date: "2024-05-28", average: 233, score: 190 },
  { date: "2024-05-29", average: 78, score: 130 },
  { date: "2024-05-30", average: 340, score: 280 },
  { date: "2024-05-31", average: 178, score: 230 },
  { date: "2024-06-01", average: 178, score: 200 },
  { date: "2024-06-02", average: 470, score: 410 },
  { date: "2024-06-03", average: 103, score: 160 },
  { date: "2024-06-04", average: 439, score: 380 },
  { date: "2024-06-05", average: 88, score: 140 },
  { date: "2024-06-06", average: 294, score: 250 },
  { date: "2024-06-07", average: 323, score: 370 },
  { date: "2024-06-08", average: 385, score: 320 },
  { date: "2024-06-09", average: 438, score: 480 },
  { date: "2024-06-10", average: 155, score: 200 },
  { date: "2024-06-11", average: 92, score: 150 },
  { date: "2024-06-12", average: 492, score: 420 },
  { date: "2024-06-13", average: 81, score: 130 },
  { date: "2024-06-14", average: 426, score: 380 },
  { date: "2024-06-15", average: 307, score: 350 },
  { date: "2024-06-16", average: 371, score: 310 },
  { date: "2024-06-17", average: 475, score: 520 },
  { date: "2024-06-18", average: 107, score: 170 },
  { date: "2024-06-19", average: 341, score: 290 },
  { date: "2024-06-20", average: 408, score: 450 },
  { date: "2024-06-21", average: 169, score: 210 },
  { date: "2024-06-22", average: 317, score: 270 },
  { date: "2024-06-23", average: 480, score: 530 },
  { date: "2024-06-24", average: 132, score: 180 },
  { date: "2024-06-25", average: 141, score: 190 },
  { date: "2024-06-26", average: 434, score: 380 },
  { date: "2024-06-27", average: 448, score: 490 },
  { date: "2024-06-28", average: 149, score: 200 },
  { date: "2024-06-29", average: 103, score: 160 },
  { date: "2024-06-30", average: 446, score: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "average",
    color: "blue",
  },
  mobile: {
    label: "score",
    color: "green",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
              <Area
              dataKey="score"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <Area
              dataKey="average"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
         
        
     
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
