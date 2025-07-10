import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourClient, 
  CreateClientParams, 
  UpdateClientParams, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListClientsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
});

const GetClientSchema = z.object({
  id: z.number(),
});

const CreateClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  businessDetails: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

const UpdateClientSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  businessDetails: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
});

const DeleteClientSchema = z.object({
  id: z.number(),
});

export const clientTools: MCPTools = {
  everhour_list_clients: {
    name: 'everhour_list_clients',
    description: 'List all clients from Everhour. Supports pagination and search query.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['clients'],
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of clients per page (default: 100)',
        },
        query: {
          type: 'string',
          description: 'Search query to filter clients by name',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListClientsSchema.parse(args);
      
      try {
        const clients = await client.getClients(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                clients: clients.map(client => ({
                  id: client.id,
                  name: client.name,
                  businessDetails: client.businessDetails,
                  projects: client.projects,
                  createdAt: client.createdAt,
                  updatedAt: client.updatedAt,
                })),
                total: clients.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing clients: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_client: {
    name: 'everhour_get_client',
    description: 'Get details of a specific client by ID.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['clients'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Client ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = GetClientSchema.parse(args);
      
      try {
        const clientData = await client.getClient(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                client: {
                  id: clientData.id,
                  name: clientData.name,
                  businessDetails: clientData.businessDetails,
                  projects: clientData.projects,
                  createdAt: clientData.createdAt,
                  updatedAt: clientData.updatedAt,
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
              text: `Error getting client: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_create_client: {
    name: 'everhour_create_client',
    description: 'Create a new client in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['clients'],
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Client name',
        },
        businessDetails: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Business name',
            },
            address: {
              type: 'string',
              description: 'Business address',
            },
            phone: {
              type: 'string',
              description: 'Business phone number',
            },
            website: {
              type: 'string',
              description: 'Business website URL',
            },
          },
          description: 'Optional business details',
        },
      },
      required: ['name'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = CreateClientSchema.parse(args);
      
      try {
        const clientData = await client.createClient(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                client: {
                  id: clientData.id,
                  name: clientData.name,
                  businessDetails: clientData.businessDetails,
                  projects: clientData.projects,
                  createdAt: clientData.createdAt,
                },
                message: `Client "${clientData.name}" created successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating client: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_client: {
    name: 'everhour_update_client',
    description: 'Update an existing client in Everhour.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['clients'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Client ID',
        },
        name: {
          type: 'string',
          description: 'New client name',
        },
        businessDetails: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Business name',
            },
            address: {
              type: 'string',
              description: 'Business address',
            },
            phone: {
              type: 'string',
              description: 'Business phone number',
            },
            website: {
              type: 'string',
              description: 'Business website URL',
            },
          },
          description: 'Business details',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, ...updateParams } = UpdateClientSchema.parse(args);
      
      try {
        const clientData = await client.updateClient(id, updateParams);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                client: {
                  id: clientData.id,
                  name: clientData.name,
                  businessDetails: clientData.businessDetails,
                  projects: clientData.projects,
                  updatedAt: clientData.updatedAt,
                },
                message: `Client "${clientData.name}" updated successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating client: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_client: {
    name: 'everhour_delete_client',
    description: 'Delete a client from Everhour. This action cannot be undone.',
    readonly: false,
    operationType: 'delete',
    affectedResources: ['clients'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Client ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteClientSchema.parse(args);
      
      try {
        await client.deleteClient(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Client with ID "${id}" deleted successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting client: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};