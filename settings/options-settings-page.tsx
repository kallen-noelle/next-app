"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { settingsApi} from "@/lib/endpoints";
import { SettingsSection } from "./settings-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export function OptionsSettingsPage({ onClose }: { onClose?: () => void }) {
  const [optionList, setOptionList] = useState([]);
  const [userSettings, setUserSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 获取用户设置
  const fetchUserSettings = async () => {
    try {
      const response = await settingsApi.getUserSettings();
      setUserSettings(response.data);
      return response.data;
    } catch (error) {
      console.error('获取用户设置失败:', error);
      return {};
    }
  };

  // 获取模型列表
  const fetchModels = async () => {
    try {
      const response = await settingsApi.getModels();
      return response.data;
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return { rows: [] };
    }
  };

  // 初始化组件数据
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        
        // 并行获取数据
        const [userSettingsData, modelsData] = await Promise.all([
          fetchUserSettings(),
          fetchModels()
        ]);
        
        // 过滤模型数据
        const visualModels = modelsData.rows.filter(item => item.mode === 1);
        const languageModels = modelsData.rows.filter(item => item.mode === 2);
        
        // 构建选项列表
        const initialOptions = [
          { 
            id: "enable_enhance", 
            name: "启用增强", 
            description: "提取和分析 PDF 内容",  
            category: "switch", 
            enabled: userSettingsData.enable_enhance !== undefined ? userSettingsData.enable_enhance : false 
          },
          { 
            id: "enable_knowledge", 
            name: "启用数据分析", 
            description: "对数据进行统计分析", 
            category: "switch", 
            enabled: userSettingsData.enable_knowledge !== undefined ? userSettingsData.enable_knowledge : false 
          },
          { 
            id: "rec_mode", 
            name: "识别模式", 
            description: "识别模式：aliyun=阿里云，bailian=百炼",  
            category: "option", 
            options: [{ name: "aliyun" }, { name: "bailian" }],
            value: userSettingsData.rec_mode || ""
          },
          { 
            id: "vl_model", 
            name: "视觉模式", 
            description: "视觉模型名称",  
            category: "option", 
            options: visualModels.map(model => ({ name: model.name })),
            value: userSettingsData.vl_model || ""
          },
          { 
            id: "gl_model", 
            name: "语言模式", 
            description: "语言模型名称",  
            category: "option", 
            options: languageModels.map(model => ({ name: model.name })),
            value: userSettingsData.gl_model || ""
          },
        ];
        
        setOptionList(initialOptions);
      } catch (error) {
        console.error('初始化数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initData();
  }, []);

  // 切换开关状态
  const toggleOption = (id: string) => {
    setOptionList(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  // 选择选项值
  const selectOption = (id: string, value: string) => {
    setOptionList(prev =>
      prev.map(option =>
        option.id === id ? { ...option, value } : option
      )
    );
  };

  // 保存设置
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // 构建保存的数据 - 匹配API参数名
      const settings = optionList.reduce((acc, option) => {
        if (option.category === "switch") {
          if (option.id === "enable_enhance") {
            acc.enable_enhance = option.enabled;
          } else if (option.id === "enable_knowledge") {
            acc.enable_knowledge = option.enabled;
          }
        } else if (option.category === "option" && option.value) {
          acc[option.id] = option.value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // 构建发送给API的对象 - 包含所有需要的字段
      const requestData = {
        rec_mode: settings.rec_mode,
        enable_enhance: settings.enable_enhance,
        enable_knowledge: settings.enable_knowledge,
        gl_model: settings.gl_model,
        vl_model: settings.vl_model
      };
      
      // 调用API保存设置
      const response = await settingsApi.updateUserSettings(requestData);
      
      console.log('保存成功:', response);
      alert('设置保存成功！');
      
      // 更新本地状态
      setUserSettings(prev => ({
        ...prev,
        ...settings
      }));
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置失败，请重试！');
    } finally {
      setIsSaving(false);
    }
  };
 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SettingsSection
          title="选项"
          description="管理和配置可用选项"
        />
        <Button 
          variant="outline" 
          size="lg"
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
        </Button>
      </div>
    
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-muted-foreground">加载设置中...</p>
        </div>
      ) : optionList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">暂无设置数据</p>
        </div>
      ) : (
        <div className="space-y-2">
          {optionList.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <div className="font-medium">{option.name}</div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${option.category === "switch" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {option.category === "switch" ? "开关" : "选项"}
                  </span>
                  {option.category === "option" && option.value && (
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                      当前值: {option.value}
                    </span>
                  )}
                </div>
              </div>
              {option.category === "switch" ? (
                <Switch
                  checked={option.enabled}
                  onCheckedChange={() => toggleOption(option.id)}
                />
              ) : (
                <Select 
                  value={option.value}
                  onValueChange={(value) => selectOption(option.id, value)}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {option.options.map((item, index) => (
                      <SelectItem key={index + item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
