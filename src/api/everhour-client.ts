import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  EverHourClient,
  EverHourProject,
  EverHourTask,
  EverHourTimeRecord,
  EverHourTimer,
  EverHourUser,
  EverHourSection,
  EverHourApiResponse,
  EverHourApiError,
  CreateTimeRecordParams,
  UpdateTimeRecordParams,
  CreateProjectParams,
  UpdateProjectParams,
  CreateTaskParams,
  UpdateTaskParams,
  CreateClientParams,
  UpdateClientParams,
  CreateSectionParams,
  UpdateSectionParams,
  TimerStartParams,
  ListParams
} from '../types/everhour.js';

export class EverHourApiClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.everhour.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data) {
          const apiError: EverHourApiError = {
            message: error.response.data.message || 'Unknown API error',
            code: error.response.data.code || 'UNKNOWN_ERROR',
            details: error.response.data.details || {},
          };
          throw new Error(`Everhour API Error: ${apiError.message} (${apiError.code})`);
        }
        throw error;
      }
    );
  }

  // Projects
  async getProjects(params?: ListParams): Promise<EverHourProject[]> {
    const response: AxiosResponse<EverHourProject[]> = await this.client.get('/projects', {
      params,
    });
    return response.data;
  }

  async getProject(id: string): Promise<EverHourProject> {
    const response: AxiosResponse<EverHourProject> = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(params: CreateProjectParams): Promise<EverHourProject> {
    const response: AxiosResponse<EverHourProject> = await this.client.post('/projects', params);
    return response.data;
  }

  async updateProject(id: string, params: UpdateProjectParams): Promise<EverHourProject> {
    const response: AxiosResponse<EverHourProject> = await this.client.put(`/projects/${id}`, params);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  // Tasks
  async getTasks(params?: ListParams): Promise<EverHourTask[]> {
    // /tasks/search requires at least a query parameter
    if (!params?.query && !params?.project) {
      // If no search criteria provided, return empty array instead of error
      return [];
    }
    
    const response: AxiosResponse<EverHourTask[]> = await this.client.get('/tasks/search', {
      params,
    });
    return response.data;
  }

  async getTask(id: string): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(projectId: string, params: CreateTaskParams): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.post(`/projects/${projectId}/tasks`, params);
    return response.data;
  }

  async updateTask(id: string, params: UpdateTaskParams): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.put(`/tasks/${id}`, params);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async getTasksForProject(projectId: string, params?: ListParams): Promise<EverHourTask[]> {
    const response: AxiosResponse<EverHourTask[]> = await this.client.get(`/projects/${projectId}/tasks`, {
      params,
    });
    return response.data;
  }

  async updateTaskEstimate(id: string, estimate: number): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.put(`/tasks/${id}/estimate`, {
      estimate
    });
    return response.data;
  }

  async deleteTaskEstimate(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}/estimate`);
  }

  async addTimeToTask(id: string, timeParams: CreateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.post(`/tasks/${id}/time`, timeParams);
    return response.data;
  }

  async updateTaskTime(id: string, timeParams: UpdateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.put(`/tasks/${id}/time`, timeParams);
    return response.data;
  }

  async deleteTaskTime(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}/time`);
  }

  async getTaskTime(id: string): Promise<EverHourTimeRecord[]> {
    const response: AxiosResponse<EverHourTimeRecord[]> = await this.client.get(`/tasks/${id}/time`);
    return response.data;
  }

  async getProjectTime(id: string): Promise<EverHourTimeRecord[]> {
    const response: AxiosResponse<EverHourTimeRecord[]> = await this.client.get(`/projects/${id}/time`);
    return response.data;
  }

  async getUserTime(id: number, params?: {
    from?: string;    // Date from (YYYY-MM-DD format)
    to?: string;      // Date to (YYYY-MM-DD format)
    limit?: number;   // Max results for pagination
    page?: number;    // Page number
  }): Promise<EverHourTimeRecord[]> {
    const response: AxiosResponse<EverHourTimeRecord[]> = await this.client.get(`/users/${id}/time`, {
      params,
    });
    return response.data;
  }

  // Time Records
  async getTimeRecords(params?: ListParams): Promise<EverHourTimeRecord[]> {
    const response: AxiosResponse<EverHourTimeRecord[]> = await this.client.get('/team/time', {
      params,
    });
    return response.data;
  }


  async createTimeRecord(params: CreateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.post('/time', params);
    return response.data;
  }

  async updateTimeRecord(id: number, params: UpdateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.put(`/time/${id}`, params);
    return response.data;
  }

  async deleteTimeRecord(id: number): Promise<void> {
    await this.client.delete(`/time/${id}`);
  }

  async getTimeRecord(id: number): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.get(`/time/${id}`);
    return response.data;
  }

  // Timers (corrected endpoints based on API docs)
  async getCurrentTimer(): Promise<EverHourTimer | null> {
    try {
      const response: AxiosResponse<EverHourTimer> = await this.client.get('/timers/current');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // No active timer
      }
      throw error;
    }
  }

  async getRunningTimer(): Promise<EverHourTimer | null> {
    // Alias for getCurrentTimer for backward compatibility
    return this.getCurrentTimer();
  }

  async getAllTeamTimers(): Promise<EverHourTimer[]> {
    const response: AxiosResponse<EverHourTimer[]> = await this.client.get('/timers');
    return response.data;
  }

  async startTimer(params: TimerStartParams): Promise<EverHourTimer> {
    const response: AxiosResponse<EverHourTimer> = await this.client.post('/timers', params);
    return response.data;
  }

  async startTimerForTask(taskId: string, comment?: string): Promise<EverHourTimer> {
    const response: AxiosResponse<EverHourTimer> = await this.client.post('/timers', {
      task: taskId,
      comment
    });
    return response.data;
  }

  async stopTimer(timerId?: number): Promise<EverHourTimeRecord> {
    // If no timer ID provided, get current timer first
    if (!timerId) {
      const currentTimer = await this.getCurrentTimer();
      if (!currentTimer || !currentTimer.id) {
        throw new Error('No active timer found to stop');
      }
      timerId = Number(currentTimer.id);
    }
    
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.post(`/timers/${timerId}/stop`);
    return response.data;
  }

  // Legacy timer endpoints (keeping for backward compatibility)
  async getTimers(params?: ListParams): Promise<EverHourTimer[]> {
    const response: AxiosResponse<EverHourTimer[]> = await this.client.get('/timers', {
      params,
    });
    return response.data;
  }

  // Clients
  async getClients(params?: ListParams): Promise<EverHourClient[]> {
    const response: AxiosResponse<EverHourClient[]> = await this.client.get('/clients', {
      params,
    });
    return response.data;
  }

  async getClient(id: number): Promise<EverHourClient> {
    const response: AxiosResponse<EverHourClient> = await this.client.get(`/clients/${id}`);
    return response.data;
  }

  async createClient(params: CreateClientParams): Promise<EverHourClient> {
    const response: AxiosResponse<EverHourClient> = await this.client.post('/clients', params);
    return response.data;
  }

  async updateClient(id: number, params: UpdateClientParams): Promise<EverHourClient> {
    const response: AxiosResponse<EverHourClient> = await this.client.put(`/clients/${id}`, params);
    return response.data;
  }

  async deleteClient(id: number): Promise<void> {
    await this.client.delete(`/clients/${id}`);
  }

  // Users
  async getUsers(params?: ListParams): Promise<EverHourUser[]> {
    const response: AxiosResponse<EverHourUser[]> = await this.client.get('/team/users', {
      params,
    });
    return response.data;
  }


  async getCurrentUser(): Promise<EverHourUser> {
    const response: AxiosResponse<EverHourUser> = await this.client.get('/users/me');
    return response.data;
  }

  // Timecards (Clock In/Out)
  async getTimecards(params?: ListParams): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/timecards', {
      params,
    });
    return response.data;
  }

  async getTimecard(id: number): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get(`/timecards/${id}`);
    return response.data;
  }

  async getUserTimecards(userId: number, params?: ListParams): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get(`/users/${userId}/timecards`, {
      params,
    });
    return response.data;
  }

  async updateTimecard(id: number, params: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.put(`/timecards/${id}`, params);
    return response.data;
  }

  async deleteTimecard(id: number): Promise<void> {
    await this.client.delete(`/timecards/${id}`);
  }

  async clockIn(userId: number, date?: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/timecards/clock-in', {
      user: userId,
      date: date || new Date().toISOString().split('T')[0]
    });
    return response.data;
  }

  async clockOut(userId: number): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/timecards/clock-out', {
      user: userId
    });
    return response.data;
  }

  // Invoices
  async getInvoices(params?: ListParams): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/invoices', {
      params,
    });
    return response.data;
  }

  async getInvoice(id: number): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get(`/invoices/${id}`);
    return response.data;
  }

  async createInvoice(params: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/invoices', params);
    return response.data;
  }

  async updateInvoice(id: number, params: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.put(`/invoices/${id}`, params);
    return response.data;
  }

  async deleteInvoice(id: number): Promise<void> {
    await this.client.delete(`/invoices/${id}`);
  }

  async refreshInvoiceLineItems(id: number): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post(`/invoices/${id}/refresh`);
    return response.data;
  }

  async updateInvoiceStatus(id: number, status: 'draft' | 'sent' | 'paid'): Promise<any> {
    const response: AxiosResponse<any> = await this.client.put(`/invoices/${id}/status`, {
      status
    });
    return response.data;
  }

  async exportInvoice(id: number, system: 'xero' | 'quickbooks' | 'freshbooks'): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post(`/invoices/${id}/export`, {
      system
    });
    return response.data;
  }

  // Expenses
  async getExpenses(params?: ListParams): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/expenses', {
      params,
    });
    return response.data;
  }

  async createExpense(params: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/expenses', params);
    return response.data;
  }

  async updateExpense(id: number, params: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.put(`/expenses/${id}`, params);
    return response.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await this.client.delete(`/expenses/${id}`);
  }

  async getExpenseCategories(): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/expenses/categories');
    return response.data;
  }

  async createExpenseCategory(name: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/expenses/categories', {
      name
    });
    return response.data;
  }

  async updateExpenseCategory(id: number, name: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client.put(`/expenses/categories/${id}`, {
      name
    });
    return response.data;
  }

  async deleteExpenseCategory(id: number): Promise<void> {
    await this.client.delete(`/expenses/categories/${id}`);
  }

  async createExpenseAttachment(file: any): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post('/expenses/attachments', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async addAttachmentToExpense(expenseId: number, attachmentId: number): Promise<any> {
    const response: AxiosResponse<any> = await this.client.post(`/expenses/${expenseId}/attachments`, {
      attachmentId
    });
    return response.data;
  }

  // Schedule/Resource Planning - These endpoints don't exist in the Everhour API
  // Commenting out until/unless they become available
  /*
  async getScheduleAssignments(params?: ListParams): Promise<any[]> {
    throw new Error('Schedule/Resource Planning endpoints are not available in the Everhour API');
  }

  async createScheduleAssignment(params: any): Promise<any> {
    throw new Error('Schedule/Resource Planning endpoints are not available in the Everhour API');
  }

  async updateScheduleAssignment(id: number, params: any): Promise<any> {
    throw new Error('Schedule/Resource Planning endpoints are not available in the Everhour API');
  }

  async deleteScheduleAssignment(id: number): Promise<void> {
    throw new Error('Schedule/Resource Planning endpoints are not available in the Everhour API');
  }
  */

  // Sections
  async getAllSections(params?: ListParams): Promise<EverHourSection[]> {
    // The global /sections endpoint doesn't exist, so we need to get sections from all projects
    // Limit the number of projects to check to avoid timeouts
    const projects = await this.getProjects({ limit: 20 });
    const allSections: EverHourSection[] = [];
    
    // Process projects in smaller batches to avoid timeouts
    for (let i = 0; i < Math.min(projects.length, 10); i++) {
      const project = projects[i];
      try {
        const projectSections = await this.getSections(project.id, params);
        allSections.push(...projectSections);
      } catch (error) {
        // Skip projects without sections or with permission issues
        continue;
      }
    }
    
    return allSections;
  }

  async getSections(projectId: string, params?: ListParams): Promise<EverHourSection[]> {
    const response: AxiosResponse<EverHourSection[]> = await this.client.get(`/projects/${projectId}/sections`, {
      params,
    });
    return response.data;
  }

  async getSection(id: string): Promise<EverHourSection> {
    const response: AxiosResponse<EverHourSection> = await this.client.get(`/sections/${id}`);
    return response.data;
  }

  async createSection(params: CreateSectionParams): Promise<EverHourSection> {
    const response: AxiosResponse<EverHourSection> = await this.client.post('/sections', params);
    return response.data;
  }

  async updateSection(id: string, params: UpdateSectionParams): Promise<EverHourSection> {
    const response: AxiosResponse<EverHourSection> = await this.client.put(`/sections/${id}`, params);
    return response.data;
  }

  async deleteSection(id: string): Promise<void> {
    await this.client.delete(`/sections/${id}`);
  }

  // Utility methods
  async testConnection(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  parseTimeToSeconds(timeString: string): number {
    const timeRegex = /(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
    const match = timeString.match(timeRegex);
    
    if (!match) {
      throw new Error('Invalid time format. Use format like "1h 30m 45s", "90m", or "3600s"');
    }
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    
    return hours * 3600 + minutes * 60 + seconds;
  }
}