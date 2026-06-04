"use client";

export function AboutSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
       
        <div>
          <h2 className="text-xl font-semibold">关于</h2>
          <p className="text-sm text-muted-foreground">作业批改</p>
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">由DL,LKY,PC等合作开发</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          作业批改 是一款基于 Next.js 16 + React 19 + Tailwind CSS 的作业批改应用。
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-sm text-muted-foreground">版本</span>
          <span className="text-sm font-medium">0.1.0</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-sm text-muted-foreground">构建日期</span>
          <span className="text-sm font-medium">2026-06-1</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-sm text-muted-foreground">技术栈</span>
          <span className="text-sm font-medium">Next.js 16 + React 19</span>
        </div>
      </div>
    </div>
  );
}
