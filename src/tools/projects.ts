import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourProject, 
  CreateProjectParams, 
  UpdateProjectParams, 
  ListParams,
  MCPTools
} from '../types/everhour.js';

// Zod schemas for input validation
const ListProjectsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
  client: z.number().optional(),
});

const GetProjectSchema = z.object({
  id: z.string(),
});

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  client: z.number().optional(),
  type: z.enum(['board', 'list']).optional(),
  billing: z.object({
    type: z.enum(['flat_rate', 'hourly_rate', 'none']).optional(),
    budget: z.number().optional(),
    rate: z.number().optional(),
  }).optional(),
});

const UpdateProjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
  billing: z.object({
    type: z.enum(['flat_rate', 'hourly_rate', 'none']).optional(),
    budget: z.number().optional(),
    rate: z.number().optional(),
  }).optional(),
});

const DeleteProjectSchema = z.object({
  id: z.string(),
});

export const projectTools: MCPTools = {
  everhour_list_projects: {
    name: 'everhour_list_projects',
    description: 'List all projects from Everhour. Supports filtering by status, client, and search query.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['projects'],
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of projects per page (default: 100)',
        },
        query: {
          type: 'string',
          description: 'Search query to filter projects by name',
        },
        status: {
          type: 'string',
          enum: ['active', 'archived', 'completed'],
          description: 'Filter projects by status',
        },
        client: {
          type: 'number',
          description: 'Filter projects by client ID',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListProjectsSchema.parse(args);
      
      try {
        const projects = await client.getProjects(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                projects: projects.map(project => ({
                  id: project.id,
                  name: project.name,
                  status: project.status,
                  client: project.client,
                  type: project.type,
                  billing: project.billing,
                  time: project.time,
                  createdAt: project.createdAt,
                  updatedAt: project.updatedAt,
                })),
                total: projects.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_project: {
    name: 'everhour_get_project',
    description: 'Get details of a specific project by ID.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['projects'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = GetProjectSchema.parse(args);
      
      try {
        const project = await client.getProject(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                project: {
                  id: project.id,
                  name: project.name,
                  status: project.status,
                  client: project.client,
                  type: project.type,
                  billing: project.billing,
                  time: project.time,
                  createdAt: project.createdAt,
                  updatedAt: project.updatedAt,
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
              text: `Error getting project: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_create_project: {
    name: 'everhour_create_project',
    description: 'Create a new project in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['projects'],
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Project name',
        },
        client: {
          type: 'number',
          description: 'Client ID to associate with the project',
        },
        type: {
          type: 'string',
          enum: ['board', 'list'],
          description: 'Project type (board or list)',
        },
        billing: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['flat_rate', 'hourly_rate', 'none'],
              description: 'Billing type',
            },
            budget: {
              type: 'number',
              description: 'Project budget',
            },
            rate: {
              type: 'number',
              description: 'Hourly rate',
            },
          },
          description: 'Billing configuration',
        },
      },
      required: ['name'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = CreateProjectSchema.parse(args);
      
      try {
        const project = await client.createProject(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                project: {
                  id: project.id,
                  name: project.name,
                  status: project.status,
                  client: project.client,
                  type: project.type,
                  billing: project.billing,
                  createdAt: project.createdAt,
                },
                message: `Project "${project.name}" created successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_project: {
    name: 'everhour_update_project',
    description: 'Update an existing project in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['projects'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID',
        },
        name: {
          type: 'string',
          description: 'New project name',
        },
        status: {
          type: 'string',
          enum: ['active', 'archived', 'completed'],
          description: 'Project status',
        },
        billing: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['flat_rate', 'hourly_rate', 'none'],
              description: 'Billing type',
            },
            budget: {
              type: 'number',
              description: 'Project budget',
            },
            rate: {
              type: 'number',
              description: 'Hourly rate',
            },
          },
          description: 'Billing configuration',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, ...updateParams } = UpdateProjectSchema.parse(args);
      
      try {
        const project = await client.updateProject(id, updateParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                project: {
                  id: project.id,
                  name: project.name,
                  status: project.status,
                  client: project.client,
                  type: project.type,
                  billing: project.billing,
                  updatedAt: project.updatedAt,
                },
                message: `Project "${project.name}" updated successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_project: {
    name: 'everhour_delete_project',
    description: 'Delete a project from Everhour. This action cannot be undone.',
    readonly: false,
    operationType: 'delete',
    affectedResources: ['projects'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Project ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteProjectSchema.parse(args);
      
      try {
        await client.deleteProject(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Project with ID "${id}" deleted successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting project: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};