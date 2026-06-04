"use client";

import { MonitorSmartphone, Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, type ComponentType, type SVGProps } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { SettingsSection } from "../components/settings-section";

const languageOptions = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
];

type ThemeMode = "system" | "light" | "dark" | "theme-purple" | "theme-blue" | "theme-green";

export function AppearanceSettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = (theme ?? "system") as ThemeMode;


  const themeOptions = useMemo(
    () => [
      {
        id: "system",
        label: "系统",
        description: "跟随系统主题设置",
        icon: MonitorSmartphone,
        color: "bg-black",
      },
      {
        id: "light",
        label: "亮色",
        description: "明亮清爽的界面风格",
        icon: Sun,
        color: "bg-black",
      },
      {
        id: "dark",
        label: "暗色",
        description: "深色护眼的界面风格",
        icon: Moon,
        color: "bg-white",
      },
      {
        id: "theme-purple",
        label: "紫色",
        description: "优雅神秘的紫色风格",
        icon: Palette,
        color: "bg-purple-500",
      },
      {
        id: "theme-blue",
        label: "蓝色",
        description: "清新宁静的蓝色风格",
        icon: Palette,
        color: "bg-blue-500",
      },
      {
        id: "theme-green",
        label: "绿色",
        description: "自然活力的绿色风格",
        icon: Palette,
        color: "bg-green-500",
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <SettingsSection
        title="主题"
        description="选择您喜欢的界面主题"
      >
        <div className="grid gap-3 lg:grid-cols-3">
          {themeOptions.map((option) => (
            <ThemePreviewCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              description={option.description}
              active={currentTheme === option.id}
              mode={option.id as ThemeMode}
              systemTheme={systemTheme}
              color={option.color}
              onSelect={(value) => setTheme(value)}
            />
          ))}
        </div>
      </SettingsSection>

      <Separator />

      <SettingsSection
        title="语言"
        description="设置应用显示语言"
      >
        <Select value="zh-CN">
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsSection>
    </div>
  );
}

function ThemePreviewCard({
  icon: Icon,
  label,
  description,
  active,
  mode,
  systemTheme,
  color,
  onSelect,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  description: string;
  active: boolean;
  mode: ThemeMode;
  systemTheme?: string;
  color?: string;
  onSelect: (mode: ThemeMode) => void;
}) {
  const previewMode =
    mode === "system" ? (systemTheme === "dark" ? "dark" : "light") : mode;
  
  const isCustomTheme = mode.startsWith("theme-");
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border p-4 text-left transition-all",
        active
          ? "border-primary ring-primary/30 shadow-sm ring-2"
          : "hover:border-border hover:shadow-sm",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="bg-muted rounded-md p-2">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <div className="text-sm leading-none font-semibold">{label}</div>
          <p className="text-muted-foreground text-xs leading-snug">
            {description}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-md border text-xs transition-colors",
          isCustomTheme
            ? "border-border bg-card text-card-foreground"
            : previewMode === "dark"
            ? "border-neutral-800 bg-neutral-900 text-neutral-200"
            : "border-slate-200 bg-white text-slate-900",
        )}
      >
        <div className="border-border/50 flex items-center gap-2 border-b px-3 py-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              color || (previewMode === "dark" ? "bg-emerald-400" : "bg-emerald-500"),
            )}
          />
          <div className="h-2 w-10 rounded-full bg-current/20" />
          <div className="h-2 w-6 rounded-full bg-current/15" />
        </div>
        <div className="grid grid-cols-[1fr_240px] gap-3 px-3 py-3">
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-current/15" />
            <div className="h-3 w-1/2 rounded-full bg-current/10" />
            <div className="h-[90px] rounded-md border border-current/10 bg-current/5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-current/10" />
              <div className="space-y-2">
                <div className="h-2 w-14 rounded-full bg-current/15" />
                <div className="h-2 w-10 rounded-full bg-current/10" />
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-md border border-dashed border-current/15 p-2">
              <div className="h-2 w-3/5 rounded-full bg-current/15" />
              <div className="h-2 w-2/5 rounded-full bg-current/10" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
