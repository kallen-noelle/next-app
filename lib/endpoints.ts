import { apiClient } from '@/lib/api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Homework,
  GradingResult,
  UserStatistics,
  GlobalStatistics,
  ApiResponse,
  PaginatedResponse,
} from '@/types';
import { useSettings } from '@/context/SettingsContext';
export const authApi = {
  register: (data: RegisterRequest) =>{
    return {
    "code": 0,
    "message": "string",
    "data": {
        "account": "zhangsan",
        "create_time": "2026-06-01T08:00:00",
        "email": "zhangsan@example.com",
        "id": 1,
        "is_active": true,
        "role": "student",
        "update_time": "2026-06-04T12:00:00",
        "username": "张三"
    }
}
  },
    // apiClient.post<AuthResponse>('/users/register', data),

  login: (account: string, password: string) =>{
      return {
      "code": 0,
      "message": "登录成功",
      "data": {
          "access_token": "mock-access-token-" + Date.now(),
          "refresh_token": "mock-refresh-token-" + Date.now(),
          "token_type": "bearer"
      }
  }
  },



  getUser: () =>{
    return {
    "code": 0,
    "message": "获取用户信息成功",
    "data": {
        "account": "zhangsan",
        "create_time": "2026-06-01T08:00:00",
        "email": "zhangsan@example.com",
        "id": 1,
        "is_active": true,
        "role": "student",
        "update_time": "2026-06-04T12:00:00",
        "username": "张三"
    }
}
  },
};

export const homeworkApi = {
  upload: (file: File, subject: string, grade: string) =>
    apiClient.uploadFile<Homework>('/homework/submit', file, { subject, grade}), 

  getHomework: async (taskId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subjectMap: Record<string, string> = {
          'task-001': '数学',
          'task-002': '语文',
          'task-003': '英语',
          'task-004': '数学',
          'task-005': '语文',
          'task-006': '英语',
          'task-007': '数学',
          'task-008': '语文',
          'task-009': '英语',
          'task-010': '数学',
          'task-011': '语文',
          'task-012': '英语',
          'task-013': '数学',
          'task-014': '语文',
          'task-015': '英语',
          'task-016': '数学',
          'task-017': '语文',
          'task-018': '英语',
          'task-019': '数学',
          'task-020': '语文',
          'task-021': '英语',
          'task-022': '数学',
          'task-023': '语文',
          'task-024': '英语',
        }
        
        const questionCountMap: Record<string, number> = {
          'task-001': 8,
          'task-002': 6,
          'task-003': 10,
          'task-004': 7,
          'task-005': 5,
          'task-006': 9,
          'task-007': 11,
          'task-008': 4,
          'task-009': 12,
          'task-010': 0,
          'task-011': 0,
          'task-012': 0,
          'task-013': 8,
          'task-014': 6,
          'task-015': 0,
          'task-016': 7,
          'task-017': 0,
          'task-018': 0,
          'task-019': 9,
          'task-020': 5,
          'task-021': 0,
          'task-022': 0,
          'task-023': 0,
          'task-024': 10,
        }
        
        const subject = subjectMap[taskId] || '数学'
        const questionCount = questionCountMap[taskId] || 5
        
        const questions = Array.from({ length: questionCount }, (_, i) => ({
          blocks: [{
            url: "/exported_image.png",
            x1: 0.1,
            x2: 0.7,
            y1: 0.05 + i * 0.15,
            y2: 0.15 + i * 0.15
          }],
          correction: {
            analysis: `第${i + 1}题分析内容`,
            comment: `第${i + 1}题评语`,
            result: 'correct',
            score: Math.floor(Math.random() * 10) + 1
          },
          create_time: "2026-06-04T10:01:00",
          knowledge_refs: [{
            content: "知识点内容",
            knowledge_id: i + 1,
            score: 0.95,
            title: `${subject}知识点汇总.pdf`
          }],
          no: `${i + 1}`,
          question_text: `${subject}第${i + 1}题题目内容`,
          question_type: "选择题",
          student_answer: `答案${i + 1}`
        }))
        
        resolve({
          "code": 0,
          "message": "string",
          "data": {
              "create_time": "2026-06-04T10:00:00",
              "grade": "二年级",
              "images": [{
                  "url": "/exported_image.png"
              }],
              "mode": "aliyun",
              "questions": questions,
              "status": "completed",
              "subject": subject,
              "task_id": taskId
          }
        });
      }, 100);
    });
  },
    // apiClient.get<Homework>(`/homework/${taskId}`),


  getList: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          "code": 0,
          "message": "string",
          "data": {
              "total": 24,
              "rows": [
                  {"create_time": "2026-06-01T10:00:00", "grade": "二年级", "id": 1, "mode": "aliyun", "status": "pending", "subject": "数学", "task_id": "task-001", "update_time": "2026-06-01T10:00:00", "user_id": 1},
                  {"create_time": "2026-06-02T11:00:00", "grade": "二年级", "id": 2, "mode": "bailian", "status": "processing", "subject": "语文", "task_id": "task-002", "update_time": "2026-06-02T11:00:00", "user_id": 1},
                  {"create_time": "2026-06-03T09:00:00", "grade": "二年级", "id": 3, "mode": "aliyun", "status": "completed", "subject": "英语", "task_id": "task-003", "update_time": "2026-06-03T09:05:00", "user_id": 1},
                  {"create_time": "2026-06-03T14:00:00", "grade": "二年级", "id": 4, "mode": "bailian", "status": "completed", "subject": "数学", "task_id": "task-004", "update_time": "2026-06-03T14:10:00", "user_id": 1},
                  {"create_time": "2026-06-04T10:00:00", "grade": "二年级", "id": 5, "mode": "aliyun", "status": "failed", "subject": "语文", "task_id": "task-005", "update_time": "2026-06-04T10:02:00", "user_id": 1},
                  {"create_time": "2026-06-04T15:00:00", "grade": "二年级", "id": 6, "mode": "bailian", "status": "pending", "subject": "英语", "task_id": "task-006", "update_time": "2026-06-04T15:00:00", "user_id": 1},
                  {"create_time": "2026-06-05T08:30:00", "grade": "二年级", "id": 7, "mode": "bailian", "status": "processing", "subject": "数学", "task_id": "task-007", "update_time": "2026-06-05T08:30:00", "user_id": 1},
                  {"create_time": "2026-06-05T13:25:00", "grade": "二年级", "id": 8, "mode": "aliyun", "status": "completed", "subject": "语文", "task_id": "task-008", "update_time": "2026-06-05T13:30:00", "user_id": 1},
                  {"create_time": "2026-06-01T09:00:00", "grade": "二年级", "id": 9, "mode": "bailian", "status": "completed", "subject": "英语", "task_id": "task-009", "update_time": "2026-06-01T09:08:00", "user_id": 1},
                  {"create_time": "2026-06-02T10:00:00", "grade": "二年级", "id": 10, "mode": "aliyun", "status": "failed", "subject": "数学", "task_id": "task-010", "update_time": "2026-06-02T10:01:00", "user_id": 1},
                  {"create_time": "2026-06-03T11:00:00", "grade": "二年级", "id": 11, "mode": "bailian", "status": "pending", "subject": "语文", "task_id": "task-011", "update_time": "2026-06-03T11:00:00", "user_id": 1},
                  {"create_time": "2026-06-04T13:00:00", "grade": "二年级", "id": 12, "mode": "aliyun", "status": "processing", "subject": "英语", "task_id": "task-012", "update_time": "2026-06-04T13:00:00", "user_id": 1},
                  {"create_time": "2026-06-05T09:30:00", "grade": "二年级", "id": 13, "mode": "bailian", "status": "completed", "subject": "数学", "task_id": "task-013", "update_time": "2026-06-05T09:38:00", "user_id": 1},
                  {"create_time": "2026-06-01T14:00:00", "grade": "二年级", "id": 14, "mode": "aliyun", "status": "completed", "subject": "语文", "task_id": "task-014", "update_time": "2026-06-01T14:12:00", "user_id": 1},
                  {"create_time": "2026-06-02T13:00:00", "grade": "二年级", "id": 15, "mode": "bailian", "status": "pending", "subject": "英语", "task_id": "task-015", "update_time": "2026-06-02T13:00:00", "user_id": 1},
                  {"create_time": "2026-06-03T08:00:00", "grade": "二年级", "id": 16, "mode": "aliyun", "status": "completed", "subject": "数学", "task_id": "task-016", "update_time": "2026-06-03T08:10:00", "user_id": 1},
                  {"create_time": "2026-06-04T14:00:00", "grade": "二年级", "id": 17, "mode": "bailian", "status": "processing", "subject": "语文", "task_id": "task-017", "update_time": "2026-06-04T14:00:00", "user_id": 1},
                  {"create_time": "2026-06-05T10:30:00", "grade": "二年级", "id": 18, "mode": "aliyun", "status": "failed", "subject": "英语", "task_id": "task-018", "update_time": "2026-06-05T10:32:00", "user_id": 1},
                  {"create_time": "2026-06-01T15:00:00", "grade": "二年级", "id": 19, "mode": "bailian", "status": "completed", "subject": "数学", "task_id": "task-019", "update_time": "2026-06-01T15:15:00", "user_id": 1},
                  {"create_time": "2026-06-02T08:30:00", "grade": "二年级", "id": 20, "mode": "aliyun", "status": "completed", "subject": "语文", "task_id": "task-020", "update_time": "2026-06-02T08:40:00", "user_id": 1},
                  {"create_time": "2026-06-03T13:30:00", "grade": "二年级", "id": 21, "mode": "bailian", "status": "processing", "subject": "英语", "task_id": "task-021", "update_time": "2026-06-03T13:30:00", "user_id": 1},
                  {"create_time": "2026-06-04T10:30:00", "grade": "二年级", "id": 22, "mode": "aliyun", "status": "pending", "subject": "数学", "task_id": "task-022", "update_time": "2026-06-04T10:30:00", "user_id": 1},
                  {"create_time": "2026-06-05T14:00:00", "grade": "二年级", "id": 23, "mode": "bailian", "status": "failed", "subject": "语文", "task_id": "task-023", "update_time": "2026-06-05T14:01:00", "user_id": 1},
                  {"create_time": "2026-06-01T11:00:00", "grade": "二年级", "id": 24, "mode": "aliyun", "status": "completed", "subject": "英语", "task_id": "task-024", "update_time": "2026-06-01T11:08:00", "user_id": 1}
              ]
          }
        });
      }, 500);
    });
  },
    // apiClient.post<ApiResponse<PaginatedResponse<Homework>>>(`task/page`, { page,page_size,subject,status,grade,}),
    delete: async (taskId: string) => {
      try {
        return await apiClient.delete(`/homework/task/${taskId}`);
      } catch (error) {
        // 如果API调用失败，返回模拟数据作为后备
        return {
          "code": 0,
          "message": "删除成功",
          "data": null
        };
      }
    },
    
    getResult: async (taskId: string) => {
      try {
        return await apiClient.get(`/homework/result/${taskId}`);
      } catch (error) {
        // 如果API调用失败，返回模拟数据作为后备
        return {
          "code": 0,
          "message": "获取成功",
          "data": {
            "create_time": "2026-06-04T10:00:00",
            "grade": "二年级",
            "images": [
              { "url": "/exported_image.png" },
              { "url": "/exported_image.png" },
              { "url": "/exported_image.png" }
            ],
            "mode": "aliyun",
            "questions": [
            {
                "blocks": [
                    {
                        "url": "/exported_image.png",
                        "x1": 0.12,
                        "x2": 0.65,
                        "y1": 0.08,
                        "y2": 0.35
                    }
                ],
                "correction": {
                    "analysis": "12-3+5=14，先减后加，运算顺序正确",
                    "comment": "回答正确，计算过程无误",
                    "result": "correct",
                    "score": 10
                },
                "create_time": "2026-06-04T10:01:00",
                "knowledge_refs": [
                    {
                        "content": "加减混合运算：在没有括号的算式里，只有加减法，要从左往右按顺序计算。",
                        "knowledge_id": 1,
                        "score": 0.95,
                        "title": "二年级数学知识点汇总.pdf"
                    }
                ],
                "no": "1",
                "question_text": "小明有12个苹果，吃了3个，又买了5个，现在有多少个苹果？",
                "question_type": "应用题",
                "student_answer": "14个"
            }

            ],
            "status": "completed",
            "subject": "数学",
            "task_id": taskId
          }
        };
      }
    },
};
export const knowledgeApi = {
  upload: async (file: File, subject?: string, grade?: string) => {
    try {
      return await apiClient.uploadFile('/knowledge/upload', file, { subject, grade });
    } catch (error) {
      // 如果API调用失败，返回模拟数据作为后备
      const fileName = file.name;
      const userId = localStorage.getItem('user_id') ? Number(localStorage.getItem('user_id')) : 2;
      
      return {
        "code": 0,
        "message": "上传成功",
        "data": {
            "chunk": Math.floor(Math.random() * 20) + 10,
            "create_time": new Date().toISOString().slice(0, 19),
            "grade": grade || "二年级",
            "id": Math.floor(Math.random() * 100) + 1,
            "status": "completed",
            "subject": subject || "数学",
            "title": fileName,
            "url": `knowledge/${userId}/${Date.now()}_${fileName}`,
            "user_id": userId
        }
      };
    }
  },
  
  getList: async () => {
    try {
      return await apiClient.post('/knowledge/page', {});
    } catch (error) {
      // 如果API调用失败，返回模拟数据作为后备
      return {
        "code": 0,
        "message": "success",
        "data": {
            "total": 12,
            "rows": [
                {"chunk": 12,"create_time": "2026-06-02T09:00:00","grade": "二年级","id": 1,"status": "completed","subject": "数学","title": "二年级数学知识点汇总.pdf","url": "knowledge/2/1717488000_math_knowledge.pdf","user_id": 2},
                {"chunk": 8,"create_time": "2026-06-02T14:30:00","grade": "三年级","id": 2,"status": "completed","subject": "语文","title": "三年级语文古诗词鉴赏.pdf","url": "knowledge/2/1717488001_chinese_knowledge.pdf","user_id": 2},
                {"chunk": 15,"create_time": "2026-06-03T10:00:00","grade": "二年级","id": 3,"status": "completed","subject": "英语","title": "二年级英语语法精讲.pdf","url": "knowledge/2/1717488002_english_knowledge.pdf","user_id": 2},
                {"chunk": 10,"create_time": "2026-06-03T15:00:00","grade": "四年级","id": 4,"status": "completed","subject": "数学","title": "四年级数学应用题解析.pdf","url": "knowledge/2/1717488003_math_knowledge.pdf","user_id": 2},
                {"chunk": 18,"create_time": "2026-06-04T08:30:00","grade": "二年级","id": 5,"status": "completed","subject": "语文","title": "二年级语文阅读理解技巧.pdf","url": "knowledge/2/1717488004_chinese_knowledge.pdf","user_id": 2},
                {"chunk": 7,"create_time": "2026-06-04T11:00:00","grade": "三年级","id": 6,"status": "completed","subject": "英语","title": "三年级英语词汇汇总.pdf","url": "knowledge/2/1717488005_english_knowledge.pdf","user_id": 2},
                {"chunk": 14,"create_time": "2026-06-04T16:00:00","grade": "五年级","id": 7,"status": "completed","subject": "数学","title": "五年级数学几何图形讲解.pdf","url": "knowledge/2/1717488006_math_knowledge.pdf","user_id": 2},
                {"chunk": 9,"create_time": "2026-06-05T09:00:00","grade": "二年级","id": 8,"status": "processing","subject": "科学","title": "二年级科学实验指南.pdf","url": "knowledge/2/1717488007_science_knowledge.pdf","user_id": 2},
                {"chunk": 11,"create_time": "2026-06-05T13:00:00","grade": "四年级","id": 9,"status": "completed","subject": "语文","title": "四年级语文作文写作指导.pdf","url": "knowledge/2/1717488008_chinese_knowledge.pdf","user_id": 2},
                {"chunk": 16,"create_time": "2026-06-05T15:30:00","grade": "三年级","id": 10,"status": "completed","subject": "数学","title": "三年级数学分数运算详解.pdf","url": "knowledge/2/1717488009_math_knowledge.pdf","user_id": 2},
                {"chunk": 13,"create_time": "2026-06-06T10:00:00","grade": "二年级","id": 11,"status": "pending","subject": "英语","title": "二年级英语听力训练.pdf","url": "knowledge/2/1717488010_english_knowledge.pdf","user_id": 2},
                {"chunk": 6,"create_time": "2026-06-06T14:00:00","grade": "五年级","id": 12,"status": "completed","subject": "语文","title": "五年级语文文言文翻译.pdf","url": "knowledge/2/1717488011_chinese_knowledge.pdf","user_id": 2},
            ]
        }
      };
    }
  },
  
  delete: async (id: number) => {
    try {
      return await apiClient.delete(`/knowledge/${id}`);
    } catch (error) {
      // 如果API调用失败，返回模拟数据作为后备
      return {
        "code": 0,
        "message": "删除成功",
        "data": {
            "id": id
        }
      };
    }
  },
  
  getDetail: async (id: number) => {
    try {
      return await apiClient.get(`/knowledge/${id}`);
    } catch (error) {
      // 如果API调用失败，返回模拟数据作为后备
      return {
        "code": 0,
        "message": "获取成功",
        "data": {
            "chunk": 15,
            "create_time": "2026-06-04T09:00:00",
            "grade": "二年级",
            "id": id,
            "status": "completed",
            "subject": "数学",
            "title": "知识文档.pdf",
            "url": `knowledge/2/${id}_knowledge.pdf`,
            "user_id": 2
        }
      };
    }
  },


}

export const optionsApi = {
  getOptions: (page: number = 1, page_size: number = 100) =>{
    return {
    "code": 0,
    "message": "string",
    "data": {
        "total": 0,
        "rows": [
            {
                "id": 1,
                "mode": 1,
                "name": "qwen-vl-max"
            }
        ]
    }
}
  },
    // apiClient.post<ApiResponse<any>>('/models/page', { page, page_size }),
}

export const statisticsApi = {
  getUserStatistics: (userId: number) =>
    apiClient.get<ApiResponse<UserStatistics>>(`/statistics/user/${userId}`),

  getGlobalStatistics: () =>
    apiClient.get<GlobalStatistics>('/statistics/global'),
};

export const settingsApi = {
    getModels: () => {
        return {
            "code": 0,
            "message": "success",
            "data": {
                "total": 6,
                "rows": [
                    { "id": 1, "mode": 1, "name": "qwen-vl-max" },
                    { "id": 2, "mode": 1, "name": "qwen-vl-plus" },
                    { "id": 3, "mode": 1, "name": "qwen-vl-mini" },
                    { "id": 4, "mode": 2, "name": "qwen-max" },
                    { "id": 5, "mode": 2, "name": "qwen-plus" },
                    { "id": 6, "mode": 2, "name": "qwen-mini" }
                ]
            }
        }
    },
    getUserSettings: () => {
        return {
            "code": 0,
            "message": "success",
            "data": {
                "create_time": "2026-06-01T08:00:00",
                "enable_enhance": true,
                "enable_knowledge": true,
                "gl_model": "qwen-max",
                "id": 1,
                "rec_mode": "aliyun",
                "update_time": "2026-06-04T12:00:00",
                "user_id": 1,
                "vl_model": "qwen-vl-max"
            }
        }
    },
    updateUserSettings: (settings: {
        rec_mode: string;
        enable_enhance: boolean;
        enable_knowledge: boolean;
        gl_model: string;
        vl_model?: string;
    }) => {
        return {
            "code": 0,
            "message": "success",
            "data": settings
        }
    },
}