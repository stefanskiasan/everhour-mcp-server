import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourUser, 
  ListParams 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListUsersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  query: z.string().optional(),
});

const GetUserSchema = z.object({
  id: z.number(),
});

export const userTools = {
  everhour_get_current_user: {
    name: 'everhour_get_current_user',
    description: 'Get the current user profile using the /me endpoint.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      try {
        const user = await client.getCurrentUser();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                  avatarUrl: user.avatarUrl,
                  timezone: user.timezone,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
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
              text: `Error getting current user: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_list_team_users: {
    name: 'everhour_list_team_users',
    description: 'List all team users using the /users endpoint. Supports pagination and search query.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of users per page (default: 100)',
        },
        query: {
          type: 'string',
          description: 'Search query to filter users by name or email',
        },
      },
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListUsersSchema.parse(args);
      
      try {
        const users = await client.getUsers(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                users: users.map(user => ({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                  avatarUrl: user.avatarUrl,
                  timezone: user.timezone,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                })),
                total: users.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing team users: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_user: {
    name: 'everhour_get_user',
    description: 'Get details of a specific team user by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = GetUserSchema.parse(args);
      
      try {
        const user = await client.getUser(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  status: user.status,
                  avatarUrl: user.avatarUrl,
                  timezone: user.timezone,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
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
              text: `Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};