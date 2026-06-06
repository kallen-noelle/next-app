"use client";

import { Bell, Info, Brain, Palette, Sparkles, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { AboutSettingsPage } from "../settings/about-settings-page";
import { OptionsSettingsPage } from "../settings/options-settings-page";
import { AppearanceSettingsPage } from "../settings/appearance-settings-page";

type SettingsSection =
  | "appearance"
  |  "options"
  | "about";

type SettingsDialogProps = React.ComponentProps<typeof Dialog> & {
  defaultSection?: SettingsSection;
};

export function SettingsDialog(props: SettingsDialogProps) {
  const { defaultSection = "appearance", ...dialogProps } = props;
  const [activeSection, setActiveSection] =useState<SettingsSection>(defaultSection);


  useEffect(() => {if (dialogProps.open) {  setActiveSection(defaultSection);}
}, [defaultSection, dialogProps.open]);

  const sections = useMemo(
    () => [
      { id: "appearance",label: "外观",icon: Palette,},
      { id: "options",label: "选项",icon: Wrench,},
      { id: "about", label: "关于", icon: Info },
    ],
    []
  );

  return (
    <Dialog
      {...dialogProps}
      onOpenChange={(open) => props.onOpenChange?.(open)}
    >
      <DialogContent
        className="flex h-[75vh] max-h-[calc(100vh-2rem)] flex-col sm:max-w-5xl md:max-w-6xl"
        aria-describedby={undefined}
      >
        <DialogHeader className="gap-1">
          <DialogTitle>设置</DialogTitle>
          <p className="text-muted-foreground text-sm">
            自定义您的设置
          </p>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[220px_1fr]">
          <nav className="bg-muted/50 min-h-0 overflow-y-auto rounded-lg p-2">
            <ul className="space-y-1 pr-1">
              {sections.map(({ id, label, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(id as SettingsSection)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ScrollArea className="h-full min-h-0 rounded-lg">
            <div className="space-y-8 p-6">
              {activeSection === "appearance" && <AppearanceSettingsPage />}
              {activeSection === "options" && <OptionsSettingsPage />}
              {activeSection === "about" && <AboutSettingsPage />}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
