import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourUser, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation - /team/users supports props parameter
const ListUsersSchema = z.object({
  props: z.array(z.string()).optional().describe('Specific user properties to return (e.g., ["id", "name", "email"])')
});

// Helper function to filter user properties based on props parameter
const filterUserProperties = (user: EverHourUser, props?: string[]) => {
  if (!props || props.length === 0) {
    // Return all properties if no specific props requested
    return {
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
    };
  }

  // Return only requested properties
  const filtered: any = {};
  props.forEach(prop => {
    if (prop in user) {
      filtered[prop] = (user as any)[prop];
    }
  });
  return filtered;
};

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
    description: 'List all team users using the /team/users endpoint. Supports selective property filtering via props parameter.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['users'],
    inputSchema: {
      type: 'object',
      properties: {
        props: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Specific user properties to return. Available properties: id, name, email, headline, role, status, type, avatarUrl, avatarUrlLarge, timezone, rate, capacity, isEmailVerified, enableResourcePlanner, favorite, createdAt, updatedAt, cost, costHistory, resourcePlannerAccess, timeTrackingPolicy, groups, budget, permissions'
        }
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
                users: users.map(user => filterUserProperties(user, params.props)),
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