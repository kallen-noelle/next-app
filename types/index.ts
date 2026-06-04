export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  role: string;
  has_password:string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;

}

export interface Homework {
  task_id: string;
  subject: string;
  grade: string;
  user_id: number;
  status: string;
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
  task_count: number;
  completed_count: number;
  avg_score: number;
  latest_score: number;
}

export interface GlobalStatistics {
  total_users: number;
  total_submissions: number;
  average_score: number;
  active_today: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  page_size: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code: number;
}
