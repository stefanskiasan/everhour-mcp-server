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
  headline?: string;
  role: 'admin' | 'manager' | 'member';
  status: 'active' | 'pending' | 'suspended';
  type?: 'employee' | 'contractor';
  avatarUrl?: string;
  avatarUrlLarge?: string;
  timezone?: string;
  rate?: number; // hourly rate in cents
  capacity?: number; // weekly capacity in seconds
  isEmailVerified?: boolean;
  enableResourcePlanner?: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt?: string;
  cost?: number; // total cost in cents
  costHistory?: Array<{
    id: number;
    cost: number;
    createdAt: string;
  }>;
  resourcePlannerAccess?: {
    viewMine: boolean;
    editMine: boolean;
    viewAll: boolean;
    editAll: boolean;
  };
  timeTrackingPolicy?: {
    allowTimeWithoutTask: boolean;
    allowManualTimeInput: boolean;
    allowFutureTime: boolean;
    allowCompletedTaskTime: boolean;
    allowTimeWithoutEstimate: boolean;
    allowExceedEstimate: boolean;
    allowManageEstimates: boolean;
    lockTimeAfter: number;
    lockTimePeriod: 'days' | 'weeks' | 'months';
  };
  groups?: Array<{
    id: number;
    name: string;
  }>;
  budget?: {
    excludeUnbillableTime: boolean;
    excludeExpenses: boolean;
    period: 'daily' | 'weekly' | 'monthly';
    type: 'time' | 'money';
    budget: number;
    disallowOverbudget: boolean;
    showToUsers: boolean;
    thresholdNotificationUsers: number[];
    progress: number;
    timeProgress: number;
    expenseProgress: number;
  };
  permissions?: Record<string, any>;
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

// Timecard interfaces
export interface EverHourTimecard {
  id: number;
  user: number;
  date: string;
  clockIn: string;
  clockOut: string;
}

export interface CreateTimecardParams {
  user: number;
  date?: string;
}

export interface UpdateTimecardParams {
  clockIn?: string;
  clockOut?: string;
}

// Invoice interfaces
export interface EverHourInvoice {
  id: number;
  number: string;
  status: 'draft' | 'sent' | 'paid';
  total: number;
}

export interface CreateInvoiceParams {
  number: string;
  status?: 'draft' | 'sent' | 'paid';
}

export interface UpdateInvoiceParams {
  status?: 'draft' | 'sent' | 'paid';
}

// Expense interfaces
export interface EverHourExpense {
  id: number;
  amount: number;
  date: string;
  description: string;
}

export interface CreateExpenseParams {
  amount: number;
  date: string;
  description?: string;
}

export interface UpdateExpenseParams {
  amount?: number;
  description?: string;
}

export interface EverHourExpenseCategory {
  id: number;
  name: string;
}

// Schedule/Assignment interfaces
export interface EverHourAssignment {
  id: number;
  user: number;
  project: string;
  date: string;
  hours: number;
}

export interface CreateAssignmentParams {
  user: number;
  project: string;
  date: string;
  hours: number;
}

export interface UpdateAssignmentParams {
  hours?: number;
}

// MCP Tool Types
import type { EverHourApiClient } from '../api/everhour-client.js';

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (client: EverHourApiClient, args: any) => Promise<any>;
  readonly: boolean; // true = safe for readonly mode, false = modifies data
  operationType: 'read' | 'write' | 'delete';
  affectedResources: string[]; // e.g., ['projects', 'tasks', 'time']
}

export interface MCPTools {
  [key: string]: MCPToolDefinition;
}

export interface ReadonlyConfig {
  enabled: boolean;
  allowedOperations: ('read' | 'write' | 'delete')[];
  blockedTools: string[];
  customRules?: (toolName: string, operationType: string) => boolean;
}