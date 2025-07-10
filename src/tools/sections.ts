import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourSection, 
  CreateSectionParams, 
  UpdateSectionParams, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListAllSectionsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
});

const GetSectionSchema = z.object({
  id: z.string(),
});

const CreateSectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  project: z.string().min(1, 'Project ID is required'),
  position: z.number().optional(),
});

const UpdateSectionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  position: z.number().optional(),
});

const DeleteSectionSchema = z.object({
  id: z.string(),
});

export const sectionTools: MCPTools = {
  everhour_list_all_sections: {
    name: 'everhour_list_all_sections',
    description: 'List all sections from Everhour using the global /sections endpoint. Supports pagination and search query.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['sections'],
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of sections per page (default: 100)',
        },
        query: {
          type: 'string',
          description: 'Search query to filter sections by name',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListAllSectionsSchema.parse(args);
      
      try {
        const sections = await client.getAllSections(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                sections: sections.map(section => ({
                  id: section.id,
                  name: section.name,
                  project: section.project,
                  position: section.position,
                  tasksCount: section.tasksCount,
                  createdAt: section.createdAt,
                  updatedAt: section.updatedAt,
                })),
                total: sections.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing all sections: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_section: {
    name: 'everhour_get_section',
    description: 'Get details of a specific section by ID.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['sections'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Section ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = GetSectionSchema.parse(args);
      
      try {
        const section = await client.getSection(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                section: {
                  id: section.id,
                  name: section.name,
                  project: section.project,
                  position: section.position,
                  tasksCount: section.tasksCount,
                  createdAt: section.createdAt,
                  updatedAt: section.updatedAt,
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
              text: `Error getting section: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_create_section: {
    name: 'everhour_create_section',
    description: 'Create a new section in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['sections'],
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Section name',
        },
        project: {
          type: 'string',
          description: 'Project ID where the section will be created',
        },
        position: {
          type: 'number',
          description: 'Position of the section within the project',
        },
      },
      required: ['name', 'project'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = CreateSectionSchema.parse(args);
      
      try {
        const section = await client.createSection(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                section: {
                  id: section.id,
                  name: section.name,
                  project: section.project,
                  position: section.position,
                  tasksCount: section.tasksCount,
                  createdAt: section.createdAt,
                },
                message: `Section "${section.name}" created successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating section: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_section: {
    name: 'everhour_update_section',
    description: 'Update an existing section in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['sections'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Section ID',
        },
        name: {
          type: 'string',
          description: 'New section name',
        },
        position: {
          type: 'number',
          description: 'New position of the section',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, ...updateParams } = UpdateSectionSchema.parse(args);
      
      try {
        const section = await client.updateSection(id, updateParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                section: {
                  id: section.id,
                  name: section.name,
                  project: section.project,
                  position: section.position,
                  tasksCount: section.tasksCount,
                  updatedAt: section.updatedAt,
                },
                message: `Section "${section.name}" updated successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating section: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_section: {
    name: 'everhour_delete_section',
    description: 'Delete a section from Everhour. This action cannot be undone.',
    readonly: false,
    operationType: 'delete',
    affectedResources: ['sections'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Section ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteSectionSchema.parse(args);
      
      try {
        await client.deleteSection(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Section with ID "${id}" deleted successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting section: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};