import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourTask, 
  EverHourTimeRecord,
  CreateTimeRecordParams,
  UpdateTimeRecordParams,
  ListParams 
} from '../types/everhour.js';

// Zod schemas for input validation
const GetTasksForProjectSchema = z.object({
  projectId: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
  status: z.enum(['open', 'closed', 'in_progress']).optional(),
  assignee: z.number().optional(),
});

const UpdateTaskEstimateSchema = z.object({
  id: z.string(),
  estimate: z.number().positive('Estimate must be positive'),
});

const DeleteTaskEstimateSchema = z.object({
  id: z.string(),
});

const AddTimeToTaskSchema = z.object({
  id: z.string(),
  time: z.union([
    z.number().positive('Time must be positive'),
    z.string().min(1, 'Time is required')
  ]),
  date: z.string().refine((date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
  comment: z.string().optional(),
});

const UpdateTaskTimeSchema = z.object({
  id: z.string(),
  time: z.union([
    z.number().positive('Time must be positive'),
    z.string().min(1, 'Time is required')
  ]).optional(),
  date: z.string().optional().refine((date) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
  comment: z.string().optional(),
});

const DeleteTaskTimeSchema = z.object({
  id: z.string(),
});

export const taskExtensionTools = {
  everhour_get_tasks_for_project: {
    name: 'everhour_get_tasks_for_project',
    description: 'Get all tasks for a specific project using the /tasks/for_project/{project_id} endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID to get tasks for',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of tasks per page (default: 100)',
        },
        query: {
          type: 'string',
          description: 'Search query to filter tasks by name',
        },
        status: {
          type: 'string',
          enum: ['open', 'closed', 'in_progress'],
          description: 'Filter tasks by status',
        },
        assignee: {
          type: 'number',
          description: 'Filter tasks by assignee user ID',
        },
      },
      required: ['projectId'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { projectId, ...params } = GetTasksForProjectSchema.parse(args);
      
      try {
        const tasks = await client.getTasksForProject(projectId, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                tasks: tasks.map(task => ({
                  id: task.id,
                  name: task.name,
                  number: task.number,
                  status: task.status,
                  type: task.type,
                  project: task.project,
                  section: task.section,
                  assignee: task.assignee,
                  labels: task.labels,
                  description: task.description,
                  time: task.time,
                  createdAt: task.createdAt,
                  updatedAt: task.updatedAt,
                })),
                total: tasks.length,
                projectId: projectId,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting tasks for project: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_task_estimate: {
    name: 'everhour_update_task_estimate',
    description: 'Update the estimate for a specific task.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
        estimate: {
          type: 'number',
          description: 'Estimate in seconds',
        },
      },
      required: ['id', 'estimate'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, estimate } = UpdateTaskEstimateSchema.parse(args);
      
      try {
        const task = await client.updateTaskEstimate(id, estimate);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                task: {
                  id: task.id,
                  name: task.name,
                  estimate: estimate,
                  estimateFormatted: client.formatTime(estimate),
                  project: task.project,
                  updatedAt: task.updatedAt,
                },
                message: `Task estimate updated to ${client.formatTime(estimate)}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating task estimate: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_task_estimate: {
    name: 'everhour_delete_task_estimate',
    description: 'Delete the estimate from a specific task.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteTaskEstimateSchema.parse(args);
      
      try {
        await client.deleteTaskEstimate(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Task estimate deleted for task ID "${id}"`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting task estimate: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_add_time_to_task: {
    name: 'everhour_add_time_to_task',
    description: 'Add time directly to a specific task using the /tasks/{id}/time endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
        time: {
          type: ['number', 'string'],
          description: 'Time in seconds (number) or human-readable format (string like "1h 30m", "90m", "5400s")',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format',
        },
        comment: {
          type: 'string',
          description: 'Optional comment for the time record',
        },
      },
      required: ['id', 'time', 'date'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, time, date, comment } = AddTimeToTaskSchema.parse(args);
      
      try {
        // Convert time to seconds if it's a string
        const timeInSeconds = typeof time === 'string' 
          ? client.parseTimeToSeconds(time)
          : time;

        const timeParams: CreateTimeRecordParams = {
          time: timeInSeconds,
          date,
          comment,
        };
        
        const timeRecord = await client.addTimeToTask(id, timeParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                timeRecord: {
                  id: timeRecord.id,
                  comment: timeRecord.comment,
                  time: timeRecord.time,
                  timeFormatted: client.formatTime(timeRecord.time),
                  date: timeRecord.date,
                  task: timeRecord.task,
                  project: timeRecord.project,
                  user: timeRecord.user,
                  createdAt: timeRecord.createdAt,
                },
                message: `Time added to task: ${client.formatTime(timeRecord.time)} on ${timeRecord.date}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding time to task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_task_time: {
    name: 'everhour_update_task_time',
    description: 'Update time for a specific task using the /tasks/{id}/time endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
        time: {
          type: ['number', 'string'],
          description: 'Time in seconds (number) or human-readable format (string like "1h 30m", "90m", "5400s")',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format',
        },
        comment: {
          type: 'string',
          description: 'Comment for the time record',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, time, ...otherParams } = UpdateTaskTimeSchema.parse(args);
      
      try {
        // Convert time to seconds if it's provided as a string
        const timeInSeconds = time !== undefined && typeof time === 'string' 
          ? client.parseTimeToSeconds(time)
          : time;

        const timeParams: UpdateTimeRecordParams = {
          ...otherParams,
          time: timeInSeconds,
        };
        
        const timeRecord = await client.updateTaskTime(id, timeParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                timeRecord: {
                  id: timeRecord.id,
                  comment: timeRecord.comment,
                  time: timeRecord.time,
                  timeFormatted: client.formatTime(timeRecord.time),
                  date: timeRecord.date,
                  task: timeRecord.task,
                  project: timeRecord.project,
                  user: timeRecord.user,
                  updatedAt: timeRecord.updatedAt,
                },
                message: `Task time updated: ${client.formatTime(timeRecord.time)} on ${timeRecord.date}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating task time: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_task_time: {
    name: 'everhour_delete_task_time',
    description: 'Delete time from a specific task using the /tasks/{id}/time endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteTaskTimeSchema.parse(args);
      
      try {
        await client.deleteTaskTime(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Time deleted from task ID "${id}"`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting task time: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};