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
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/users/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/users/login', data),

  getUser: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),
};

export const homeworkApi = {
  upload: (file: File, subject: string, grade: string) =>
    apiClient.uploadFile<Homework>('/homework/submit', file, { subject, grade}), 

  getHomework: (taskId: string) =>
    apiClient.get<Homework>(`/homework/${taskId}`),

  getResult: (taskId: string) =>
    apiClient.get<GradingResult>(`/homework/${taskId}/result`),

  getList: (page: number = 1, page_size: number = 100, subject?: string, grade?: string, status?: string) =>
    apiClient.get<ApiResponse<PaginatedResponse<Homework>>>(`/homework/list`, { 
      params: { 
        page,
        page_size,
        subject,
        status,
        grade,
      } 
    }),

  delete: (taskId: string) =>
    apiClient.delete<void>(`/homework/${taskId}`),
};
export const knowledgeApi = {
  upload: (file: File, subject?: string , grade?: string) =>
    apiClient.uploadFile('/knowledge/analyze', file, { subject, grade, }), 
  
  getList: (page: number = 1, page_size: number = 100) =>
  apiClient.get<ApiResponse<PaginatedResponse<Homework>>>(`/knowledge/page`, { 
    params: {  page,  page_size} 
  }),
}

export const statisticsApi = {
  getUserStatistics: (userId: number) =>
    apiClient.get<ApiResponse<UserStatistics>>(`/statistics/user/${userId}`),

  getGlobalStatistics: () =>
    apiClient.get<GlobalStatistics>('/statistics/global'),
};

export const settingsApi = {
    getModels: async () => await apiClient.get('/models'),

}