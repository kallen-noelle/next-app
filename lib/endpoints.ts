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
} from '@/types';

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/users/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/users/login', data),

  getUser: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),
};

export const homeworkApi = {
  upload: (file: File, subject: string, title: string,  userId: string ,description?: string) =>
    apiClient.uploadFile<Homework>('/homework/upload', file, { subject, title: title, description: description || '', user_id: userId }), 

  getHomework: (taskId: string) =>
    apiClient.get<Homework>(`/homework/${taskId}`),

  getResult: (taskId: string) =>
    apiClient.get<GradingResult>(`/homework/${taskId}/result`),

  getList: (userId: number) =>
    apiClient.get<ApiResponse<Homework[]>>(`/homework/list`, { params: { user_id: userId } }),

  delete: (taskId: string) =>
    apiClient.delete<void>(`/homework/${taskId}`),
};

export const statisticsApi = {
  getUserStatistics: (userId: number) =>
    apiClient.get<ApiResponse<UserStatistics>>(`/statistics/user/${userId}`),

  getGlobalStatistics: () =>
    apiClient.get<GlobalStatistics>('/statistics/global'),
};
