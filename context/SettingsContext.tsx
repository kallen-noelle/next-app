// context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Settings {
    theme: "light" | "dark";
    model: string;
    mode;
    notifications: boolean;
}

interface UserContextType {
  settings: Settings | null;
  updateSettings: (settings: Partial<Settings>) => void;
}
import { settingsApi } from "@/lib/endpoints";



const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // 直接在 useState 中初始化状态
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    } else {
      // 默认设置
      return {
        theme: "light",
        model: "gpt-3.5-turbo",
        mode: settingsApi.getModels(),
        notifications: true,
      };
    }
  });

  const updateSettings = (settingsUpdates: Partial<Settings>) => {
    const updatedSettings = settings ? { ...settings, ...settingsUpdates } : null;
    setSettings(updatedSettings);
    if (updatedSettings) {
      localStorage.setItem("settings", JSON.stringify(updatedSettings));
      localStorage.setItem("model", updatedSettings.model);
      localStorage.setItem("mode", updatedSettings.mode);
      localStorage.setItem("notifications", updatedSettings.notifications.toString());
    }
  };

  return (
    <UserContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}