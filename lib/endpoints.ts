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
  upload: (file: File, title: string, description?: string) =>
    apiClient.uploadFile<Homework>('/homework/upload', file, { title, description: description || '' }),

  getHomework: (taskId: string) =>
    apiClient.get<Homework>(`/homework/${taskId}`),

  getResult: (taskId: string) =>
    apiClient.get<GradingResult>(`/homework/${taskId}/result`),

  getList: () =>
    apiClient.get<Homework[]>('/homework/list'),

  delete: (taskId: string) =>
    apiClient.delete<void>(`/homework/${taskId}`),
};

export const statisticsApi = {
  getUserStatistics: (userId: string) =>
    apiClient.get<UserStatistics>(`/statistics/user/${userId}`),

  getGlobalStatistics: () =>
    apiClient.get<GlobalStatistics>('/statistics/global'),
};
