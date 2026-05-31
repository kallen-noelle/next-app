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
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { statisticsApi } from '@/lib/endpoints';
import { UserStatistics } from '@/types';
import { toast } from "sonner"


export function SectionCards() {
  const [stats, setStats] = useState<UserStatistics>({
    task_count: 0,
    completed_count: 0,
    avg_score: 0,
    latest_score: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const id = userId ? Number(userId) : 0;
        
        if (id === 0) {
          //toast.error('用户ID无效');
        }
        const response = await statisticsApi.getUserStatistics(id);
        setStats(response.data);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1,2,3,4].map((i) => (
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
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总作业数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.task_count}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {stats.task_count > 0 ? '+' + stats.task_count : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            已完成 {stats.completed_count} 个
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            完成率 {stats.task_count > 0 ? (stats.completed_count / stats.task_count * 100).toFixed(1) : 0}%
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>已完成作业</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.completed_count}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {stats.completed_count > 0 ? '+' + stats.completed_count : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            完成进度
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            剩余 {stats.task_count - stats.completed_count} 个作业
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>平均得分</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.avg_score.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {stats.avg_score > 0 ? '+' + stats.avg_score.toFixed(1) : '0'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            表现优秀
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            最近一次得分 {stats.latest_score.toFixed(1)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>最近得分</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.latest_score.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.latest_score >= stats.avg_score ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {stats.latest_score >= stats.avg_score 
                ? '+' + (stats.latest_score - stats.avg_score).toFixed(1) 
                : (stats.latest_score - stats.avg_score).toFixed(1)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.latest_score >= stats.avg_score ? '高于平均分' : '低于平均分'}
            {stats.latest_score >= stats.avg_score ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            继续保持，加油！
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
