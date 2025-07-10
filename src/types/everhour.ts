export interface EverHourClient {
  id: number;
  name: string;
  businessDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
  projects?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface EverHourProject {
  id: string;
  name: string;
  client?: {
    id: number;
    name: string;
  };
  status: 'active' | 'archived' | 'completed';
  type: 'board' | 'list';
  billing?: {
    type: 'flat_rate' | 'hourly_rate' | 'none';
    budget?: number;
    rate?: number;
  };
  time?: {
    total: number;
    today: number;
    week: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EverHourTask {
  id: string;
  name: string;
  number?: string;
  status: 'open' | 'closed' | 'in_progress';
  type: 'task' | 'bug' | 'feature';
  project: {
    id: string;
    name: string;
  };
  section?: {
    id: string;
    name: string;
  };
  assignee?: {
    id: number;
    name: string;
  };
  labels?: string[];
  description?: string;
  time?: {
    total: number;
    today: number;
    week: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EverHourTimeRecord {
  id: string;
  comment?: string;
  time: number; // in seconds
  date: string; // YYYY-MM-DD
  task?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EverHourTimer {
  id: string;
  status: 'active' | 'stopped';
  startedAt?: string;
  task?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
  comment?: string;
  duration?: number; // in seconds
}

export interface EverHourUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EverHourSection {
  id: string;
  name: string;
  project: {
    id: string;
    name: string;
  };
  position: number;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EverHourApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface EverHourApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface CreateTimeRecordParams {
  time: number; // in seconds
  date: string; // YYYY-MM-DD
  task?: string;
  project?: string;
  comment?: string;
}

export interface UpdateTimeRecordParams {
  time?: number;
  date?: string;
  task?: string;
  project?: string;
  comment?: string;
}

export interface CreateProjectParams {
  name: string;
  client?: number;
  type?: 'board' | 'list';
  billing?: {
    type?: 'flat_rate' | 'hourly_rate' | 'none';
    budget?: number;
    rate?: number;
  };
}

export interface UpdateProjectParams {
  name?: string;
  status?: 'active' | 'archived' | 'completed';
  billing?: {
    type?: 'flat_rate' | 'hourly_rate' | 'none';
    budget?: number;
    rate?: number;
  };
}

export interface CreateTaskParams {
  name: string;
  project: string;
  section?: string;
  assignee?: number;
  type?: 'task' | 'bug' | 'feature';
  description?: string;
  labels?: string[];
}

export interface UpdateTaskParams {
  name?: string;
  status?: 'open' | 'closed' | 'in_progress';
  type?: 'task' | 'bug' | 'feature';
  assignee?: number;
  description?: string;
  labels?: string[];
}

export interface CreateClientParams {
  name: string;
  businessDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
}

export interface UpdateClientParams {
  name?: string;
  businessDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
  };
}

export interface TimerStartParams {
  task?: string;
  project?: string;
  comment?: string;
}

export interface CreateSectionParams {
  name: string;
  project: string;
  position?: number;
}

export interface UpdateSectionParams {
  name?: string;
  position?: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  query?: string;
  status?: string;
  project?: string;
  client?: number;
  assignee?: number;
  from?: string; // date YYYY-MM-DD
  to?: string; // date YYYY-MM-DD
}