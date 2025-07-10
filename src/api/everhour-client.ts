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
    const response: AxiosResponse<EverHourTask[]> = await this.client.get('/tasks', {
      params,
    });
    return response.data;
  }

  async getTask(id: string): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(params: CreateTaskParams): Promise<EverHourTask> {
    const response: AxiosResponse<EverHourTask> = await this.client.post('/tasks', params);
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
    const response: AxiosResponse<EverHourTask[]> = await this.client.get(`/tasks/for_project/${projectId}`, {
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

  // Time Records
  async getTimeRecords(params?: ListParams): Promise<EverHourTimeRecord[]> {
    const response: AxiosResponse<EverHourTimeRecord[]> = await this.client.get('/time', {
      params,
    });
    return response.data;
  }

  async getTimeRecord(id: string): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.get(`/time/${id}`);
    return response.data;
  }

  async createTimeRecord(params: CreateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.post('/time', params);
    return response.data;
  }

  async updateTimeRecord(id: string, params: UpdateTimeRecordParams): Promise<EverHourTimeRecord> {
    const response: AxiosResponse<EverHourTimeRecord> = await this.client.put(`/time/${id}`, params);
    return response.data;
  }

  async deleteTimeRecord(id: string): Promise<void> {
    await this.client.delete(`/time/${id}`);
  }

  // Timers (corrected endpoints)
  async getCurrentTimer(): Promise<EverHourTimer | null> {
    try {
      const response: AxiosResponse<EverHourTimer> = await this.client.get('/timer');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // No active timer
      }
      throw error;
    }
  }

  async getRunningTimer(): Promise<EverHourTimer | null> {
    try {
      const response: AxiosResponse<EverHourTimer> = await this.client.get('/timer/running');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // No running timer
      }
      throw error;
    }
  }

  async startTimer(params: TimerStartParams): Promise<EverHourTimer> {
    const response: AxiosResponse<EverHourTimer> = await this.client.post('/timer/start', params);
    return response.data;
  }

  async startTimerForTask(taskId: string, comment?: string): Promise<EverHourTimer> {
    const response: AxiosResponse<EverHourTimer> = await this.client.post(`/timer/start_for/${taskId}`, {
      comment
    });
    return response.data;
  }

  async stopTimer(): Promise<EverHourTimer> {
    const response: AxiosResponse<EverHourTimer> = await this.client.post('/timer/stop');
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
    const response: AxiosResponse<EverHourUser[]> = await this.client.get('/team', {
      params,
    });
    return response.data;
  }

  async getUser(id: number): Promise<EverHourUser> {
    const response: AxiosResponse<EverHourUser> = await this.client.get(`/team/${id}`);
    return response.data;
  }

  async getCurrentUser(): Promise<EverHourUser> {
    const response: AxiosResponse<EverHourUser> = await this.client.get('/me');
    return response.data;
  }

  // Sections
  async getAllSections(params?: ListParams): Promise<EverHourSection[]> {
    const response: AxiosResponse<EverHourSection[]> = await this.client.get('/sections', {
      params,
    });
    return response.data;
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