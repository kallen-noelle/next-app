export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Homework {
  id: string;
  user_id: string;
  type: 'math' | 'english' | 'science' | 'history' | 'art' | 'music' | 'physical_education' | 'computer_science';
  target: number;//分数
  limit: string;//最高最低分数
  reviewer: string;//创建时间
  header: string;
  description?: string;
  file_url?: string;
  status: 'In Process' | 'Done';
}

export interface UploadHomeworkRequest {
  file: File;
  title: string;
  description?: string;
}

export interface GradingResult {
  task_id: string;
  score: number;
  feedback: string;
  graded_at: string;
}

export interface UserStatistics {
  user_id: string;
  total_submissions: number;
  average_score: number;
  completed_count: number;
  pending_count: number;
}

export interface GlobalStatistics {
  total_users: number;
  total_submissions: number;
  average_score: number;
  active_today: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
