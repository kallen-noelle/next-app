"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { homeworkApi } from "@/lib/endpoints"
import { Homework } from "@/types"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import data from "./data.json"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function Page() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  
  useEffect(() => {
    const loadHomework = async () => {
      try {
        const id = Number(localStorage.getItem('user_id') || '0');
        
        const response = await homeworkApi.getList(id);
        setHomework(response.data || []);
      } catch {
        toast.error('加载作业列表失败');
      } finally {
        setIsLoading(false);
      }
    };
    loadHomework();
  }, []);


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
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {isLoading ? (
                 <div className="flex flex-col items-center gap-4">
                  <Button disabled size="sm">
                    <Spinner data-icon="inline-start" />
                    Loading...
                  </Button>
                  <Button variant="outline" disabled size="sm">
                    <Spinner data-icon="inline-start" />
                    Please wait
                  </Button>
                  <Button variant="secondary" disabled size="sm">
                    <Spinner data-icon="inline-start" />
                    Processing
                  </Button>
                </div>
              ) : (
                <DataTable data={data} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
