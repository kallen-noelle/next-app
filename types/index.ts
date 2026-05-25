export interface User {
  id: string;
  name: string;
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
  title: string;
  description?: string;
  file_url?: string;
  status: 'pending' | 'grading' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
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
