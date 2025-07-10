import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourTask, 
  CreateTaskParams, 
  UpdateTaskParams, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListTasksSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
  status: z.enum(['open', 'closed', 'in_progress']).optional(),
  project: z.string().optional(),
  assignee: z.number().optional(),
});

const GetTaskSchema = z.object({
  id: z.string(),
});

const CreateTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  project: z.string().min(1, 'Project ID is required'),
  section: z.string().optional(),
  assignee: z.number().optional(),
  type: z.enum(['task', 'bug', 'feature']).optional(),
  description: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  status: z.enum(['open', 'closed', 'in_progress']).optional(),
  type: z.enum(['task', 'bug', 'feature']).optional(),
  assignee: z.number().optional(),
  description: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

const DeleteTaskSchema = z.object({
  id: z.string(),
});

export const taskTools: MCPTools = {
  everhour_list_tasks: {
    name: 'everhour_list_tasks',
    description: 'List all tasks from Everhour. Supports filtering by status, project, assignee, and search query.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['tasks'],
    inputSchema: {
      type: 'object',
      properties: {
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
        project: {
          type: 'string',
          description: 'Filter tasks by project ID',
        },
        assignee: {
          type: 'number',
          description: 'Filter tasks by assignee user ID',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListTasksSchema.parse(args);
      
      try {
        const tasks = await client.getTasks(params);
        
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
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_task: {
    name: 'everhour_get_task',
    description: 'Get details of a specific task by ID.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['tasks'],
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
      const { id } = GetTaskSchema.parse(args);
      
      try {
        const task = await client.getTask(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                task: {
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
                },
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_create_task: {
    name: 'everhour_create_task',
    description: 'Create a new task in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['tasks'],
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Task name',
        },
        project: {
          type: 'string',
          description: 'Project ID where the task will be created',
        },
        section: {
          type: 'string',
          description: 'Section ID within the project',
        },
        assignee: {
          type: 'number',
          description: 'User ID to assign the task to',
        },
        type: {
          type: 'string',
          enum: ['task', 'bug', 'feature'],
          description: 'Task type',
        },
        description: {
          type: 'string',
          description: 'Task description',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of labels to assign to the task',
        },
      },
      required: ['name', 'project'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = CreateTaskSchema.parse(args);
      
      try {
        const { project, ...taskParams } = params;
        const task = await client.createTask(project, taskParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                task: {
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
                  createdAt: task.createdAt,
                },
                message: `Task "${task.name}" created successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_task: {
    name: 'everhour_update_task',
    description: 'Update an existing task in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['tasks'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Task ID',
        },
        name: {
          type: 'string',
          description: 'New task name',
        },
        status: {
          type: 'string',
          enum: ['open', 'closed', 'in_progress'],
          description: 'Task status',
        },
        type: {
          type: 'string',
          enum: ['task', 'bug', 'feature'],
          description: 'Task type',
        },
        assignee: {
          type: 'number',
          description: 'User ID to assign the task to',
        },
        description: {
          type: 'string',
          description: 'Task description',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of labels to assign to the task',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, ...updateParams } = UpdateTaskSchema.parse(args);
      
      try {
        const task = await client.updateTask(id, updateParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                task: {
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
                  updatedAt: task.updatedAt,
                },
                message: `Task "${task.name}" updated successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_task: {
    name: 'everhour_delete_task',
    description: 'Delete a task from Everhour. This action cannot be undone.',
    readonly: false,
    operationType: 'delete',
    affectedResources: ['tasks'],
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
      const { id } = DeleteTaskSchema.parse(args);
      
      try {
        await client.deleteTask(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Task with ID "${id}" deleted successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting task: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};