import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourTimer, 
  TimerStartParams, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListTimersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  project: z.string().optional(),
  assignee: z.number().optional(),
  from: z.string().optional().refine((date) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
  to: z.string().optional().refine((date) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
});

const StartTimerSchema = z.object({
  task: z.string().optional(),
  project: z.string().optional(),
  comment: z.string().optional(),
});

const StartTimerForTaskSchema = z.object({
  taskId: z.string(),
  comment: z.string().optional(),
});

export const timerTools: MCPTools = {
  everhour_get_current_timer: {
    name: 'everhour_get_current_timer',
    description: 'Get the currently running timer, if any.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      try {
        const timer = await client.getCurrentTimer();
        
        if (!timer) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  timer: null,
                  message: 'No timer is currently running',
                }, null, 2),
              },
            ],
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                timer: {
                  id: timer.id,
                  status: timer.status,
                  startedAt: timer.startedAt,
                  task: timer.task,
                  project: timer.project,
                  user: timer.user,
                  comment: timer.comment,
                  duration: timer.duration,
                  durationFormatted: timer.duration ? client.formatTime(timer.duration) : null,
                },
                message: timer.status === 'active' ? 'Timer is currently running' : 'Timer is stopped',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting current timer: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_start_timer: {
    name: 'everhour_start_timer',
    description: 'Start a new timer in Everhour. Can be associated with a task or project.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: 'Task ID to associate with the timer',
        },
        project: {
          type: 'string',
          description: 'Project ID to associate with the timer',
        },
        comment: {
          type: 'string',
          description: 'Optional comment for the timer',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = StartTimerSchema.parse(args);
      
      try {
        // Check if there's already a running timer
        const currentTimer = await client.getCurrentTimer();
        if (currentTimer && currentTimer.status === 'active') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  currentTimer: {
                    id: currentTimer.id,
                    status: currentTimer.status,
                    startedAt: currentTimer.startedAt,
                    task: currentTimer.task,
                    project: currentTimer.project,
                    comment: currentTimer.comment,
                    duration: currentTimer.duration,
                    durationFormatted: currentTimer.duration ? client.formatTime(currentTimer.duration) : null,
                  },
                  message: 'A timer is already running. Stop the current timer before starting a new one.',
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
        
        const timer = await client.startTimer(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                timer: {
                  id: timer.id,
                  status: timer.status,
                  startedAt: timer.startedAt,
                  task: timer.task,
                  project: timer.project,
                  user: timer.user,
                  comment: timer.comment,
                },
                message: `Timer started successfully${timer.task ? ` for task "${timer.task.name}"` : ''}${timer.project ? ` in project "${timer.project.name}"` : ''}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error starting timer: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_stop_timer: {
    name: 'everhour_stop_timer',
    description: 'Stop the currently running timer.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      try {
        // Check if there's a running timer
        const currentTimer = await client.getCurrentTimer();
        if (!currentTimer || currentTimer.status !== 'active') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  message: 'No timer is currently running',
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
        
        const timeRecord = await client.stopTimer();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                timeRecord: {
                  id: timeRecord.id,
                  time: timeRecord.time,
                  date: timeRecord.date,
                  task: timeRecord.task,
                  user: timeRecord.user,
                  comment: timeRecord.comment,
                  timeFormatted: timeRecord.time ? client.formatTime(timeRecord.time) : null,
                },
                message: `Timer stopped successfully. Time recorded: ${timeRecord.time ? client.formatTime(timeRecord.time) : 'Unknown'}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error stopping timer: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_list_timers: {
    name: 'everhour_list_timers',
    description: 'List timer history from Everhour. Supports filtering by project, assignee, and date range.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of timers per page (default: 100)',
        },
        project: {
          type: 'string',
          description: 'Filter timers by project ID',
        },
        assignee: {
          type: 'number',
          description: 'Filter timers by assignee user ID',
        },
        from: {
          type: 'string',
          description: 'Start date for filtering (YYYY-MM-DD format)',
        },
        to: {
          type: 'string',
          description: 'End date for filtering (YYYY-MM-DD format)',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListTimersSchema.parse(args);
      
      try {
        const timers = await client.getTimers(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                timers: timers.map(timer => ({
                  id: timer.id,
                  status: timer.status,
                  startedAt: timer.startedAt,
                  task: timer.task,
                  project: timer.project,
                  user: timer.user,
                  comment: timer.comment,
                  duration: timer.duration,
                  durationFormatted: timer.duration ? client.formatTime(timer.duration) : null,
                })),
                total: timers.length,
                totalDuration: timers.reduce((sum, timer) => sum + (timer.duration || 0), 0),
                totalDurationFormatted: client.formatTime(timers.reduce((sum, timer) => sum + (timer.duration || 0), 0)),
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing timers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_timer_status: {
    name: 'everhour_timer_status',
    description: 'Get a summary of timer status and activity.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      try {
        const currentTimer = await client.getCurrentTimer();
        
        let statusMessage = 'No timer is currently running';
        let timerInfo = null;
        
        if (currentTimer) {
          if (currentTimer.status === 'active') {
            statusMessage = 'Timer is currently running';
            timerInfo = {
              id: currentTimer.id,
              status: currentTimer.status,
              startedAt: currentTimer.startedAt,
              task: currentTimer.task,
              project: currentTimer.project,
              comment: currentTimer.comment,
              duration: currentTimer.duration,
              durationFormatted: currentTimer.duration ? client.formatTime(currentTimer.duration) : null,
            };
          } else {
            statusMessage = 'Last timer was stopped';
            timerInfo = {
              id: currentTimer.id,
              status: currentTimer.status,
              startedAt: currentTimer.startedAt,
              task: currentTimer.task,
              project: currentTimer.project,
              comment: currentTimer.comment,
              duration: currentTimer.duration,
              durationFormatted: currentTimer.duration ? client.formatTime(currentTimer.duration) : null,
            };
          }
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: currentTimer?.status || 'inactive',
                timer: timerInfo,
                message: statusMessage,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting timer status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_running_timer: {
    name: 'everhour_get_running_timer',
    description: 'Get the currently running timer using the /timer/running endpoint.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      try {
        const timer = await client.getRunningTimer();
        
        if (!timer) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  timer: null,
                  message: 'No timer is currently running',
                }, null, 2),
              },
            ],
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                timer: {
                  id: timer.id,
                  status: timer.status,
                  startedAt: timer.startedAt,
                  task: timer.task,
                  project: timer.project,
                  user: timer.user,
                  comment: timer.comment,
                  duration: timer.duration,
                  durationFormatted: timer.duration ? client.formatTime(timer.duration) : null,
                },
                message: 'Timer is currently running',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting running timer: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_start_timer_for_task: {
    name: 'everhour_start_timer_for_task',
    description: 'Start a timer directly for a specific task using the /timer/start_for/{task_id} endpoint.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['timers'],
    inputSchema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'Task ID to start timer for',
        },
        comment: {
          type: 'string',
          description: 'Optional comment for the timer',
        },
      },
      required: ['taskId'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { taskId, comment } = StartTimerForTaskSchema.parse(args);
      
      try {
        // Check if there's already a running timer
        const currentTimer = await client.getCurrentTimer();
        if (currentTimer && currentTimer.status === 'active') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  currentTimer: {
                    id: currentTimer.id,
                    status: currentTimer.status,
                    startedAt: currentTimer.startedAt,
                    task: currentTimer.task,
                    project: currentTimer.project,
                    comment: currentTimer.comment,
                    duration: currentTimer.duration,
                    durationFormatted: currentTimer.duration ? client.formatTime(currentTimer.duration) : null,
                  },
                  message: 'A timer is already running. Stop the current timer before starting a new one.',
                }, null, 2),
              },
            ],
            isError: true,
          };
        }
        
        const timer = await client.startTimerForTask(taskId, comment);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                timer: {
                  id: timer.id,
                  status: timer.status,
                  startedAt: timer.startedAt,
                  task: timer.task,
                  project: timer.project,
                  user: timer.user,
                  comment: timer.comment,
                },
                message: `Timer started successfully for task "${timer.task?.name || taskId}"`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error starting timer for task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};