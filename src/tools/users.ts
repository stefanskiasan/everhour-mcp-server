import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourUser, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation - /team/users doesn't support pagination
const ListUsersSchema = z.object({});


export const userTools: MCPTools = {
  everhour_get_current_user: {
    name: 'everhour_get_current_user',
    description: 'Get the current user profile using the /me endpoint.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['users'],
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
                  headline: user.headline,
                  role: user.role,
                  status: user.status,
                  type: user.type,
                  avatarUrl: user.avatarUrl,
                  avatarUrlLarge: user.avatarUrlLarge,
                  timezone: user.timezone,
                  rate: user.rate,
                  capacity: user.capacity,
                  isEmailVerified: user.isEmailVerified,
                  enableResourcePlanner: user.enableResourcePlanner,
                  favorite: user.favorite,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                  cost: user.cost,
                  costHistory: user.costHistory,
                  resourcePlannerAccess: user.resourcePlannerAccess,
                  timeTrackingPolicy: user.timeTrackingPolicy,
                  groups: user.groups,
                  budget: user.budget,
                  permissions: user.permissions,
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
    description: 'List all team users using the /team/users endpoint. Returns all users without pagination.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['users'],
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = ListUsersSchema.parse(args);
      
      try {
        const users = await client.getUsers();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                users: users.map(user => ({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  headline: user.headline,
                  role: user.role,
                  status: user.status,
                  type: user.type,
                  avatarUrl: user.avatarUrl,
                  avatarUrlLarge: user.avatarUrlLarge,
                  timezone: user.timezone,
                  rate: user.rate,
                  capacity: user.capacity,
                  isEmailVerified: user.isEmailVerified,
                  enableResourcePlanner: user.enableResourcePlanner,
                  favorite: user.favorite,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                  cost: user.cost,
                  costHistory: user.costHistory,
                  resourcePlannerAccess: user.resourcePlannerAccess,
                  timeTrackingPolicy: user.timeTrackingPolicy,
                  groups: user.groups,
                  budget: user.budget,
                  permissions: user.permissions,
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

};