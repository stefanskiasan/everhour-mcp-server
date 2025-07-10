import { z } from 'zod';
import { EverHourApiClient } from '../api/everhour-client.js';
import { 
  EverHourTimeRecord, 
  CreateTimeRecordParams, 
  UpdateTimeRecordParams, 
  ListParams,
  MCPTools 
} from '../types/everhour.js';

// Zod schemas for input validation
const ListTimeRecordsSchema = z.object({
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

const GetTimeRecordSchema = z.object({
  id: z.number(),
});

const CreateTimeRecordSchema = z.object({
  time: z.union([
    z.number().positive('Time must be positive'),
    z.string().min(1, 'Time is required')
  ]),
  date: z.string().refine((date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
  task: z.string().optional(),
  project: z.string().optional(),
  comment: z.string().optional(),
});

const UpdateTimeRecordSchema = z.object({
  id: z.number(),
  time: z.union([
    z.number().positive('Time must be positive'),
    z.string().min(1, 'Time is required')
  ]).optional(),
  date: z.string().optional().refine((date) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }, 'Date must be in YYYY-MM-DD format'),
  task: z.string().optional(),
  project: z.string().optional(),
  comment: z.string().optional(),
});

const DeleteTimeRecordSchema = z.object({
  id: z.number(),
});

export const timeRecordTools: MCPTools = {
  everhour_list_time_records: {
    name: 'everhour_list_time_records',
    description: 'List time records from Everhour. Supports filtering by project, assignee, and date range.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['time'],
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Number of time records per page (default: 100)',
        },
        project: {
          type: 'string',
          description: 'Filter time records by project ID',
        },
        assignee: {
          type: 'number',
          description: 'Filter time records by assignee user ID',
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
      const params = ListTimeRecordsSchema.parse(args);
      
      try {
        const timeRecords = await client.getTimeRecords(params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                timeRecords: timeRecords.map(record => ({
                  id: record.id,
                  comment: record.comment,
                  time: record.time,
                  timeFormatted: client.formatTime(record.time),
                  date: record.date,
                  task: record.task,
                  project: record.project,
                  user: record.user,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt,
                })),
                total: timeRecords.length,
                totalTime: timeRecords.reduce((sum, record) => sum + record.time, 0),
                totalTimeFormatted: client.formatTime(timeRecords.reduce((sum, record) => sum + record.time, 0)),
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing time records: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_get_time_record: {
    name: 'everhour_get_time_record',
    description: 'Get details of a specific time record by ID.',
    readonly: true,
    operationType: 'read',
    affectedResources: ['time'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Time record ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = GetTimeRecordSchema.parse(args);
      
      try {
        const timeRecord = await client.getTimeRecord(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
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
                  updatedAt: timeRecord.updatedAt,
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
              text: `Error getting time record: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_create_time_record: {
    name: 'everhour_create_time_record',
    description: 'Create a new time record in Everhour. Time can be specified in seconds or human-readable format (e.g., "1h 30m", "90m", "5400s").',
    readonly: false,
    operationType: 'write',
    affectedResources: ['time'],
    inputSchema: {
      type: 'object',
      properties: {
        time: {
          type: ['number', 'string'],
          description: 'Time in seconds (number) or human-readable format (string like "1h 30m", "90m", "5400s")',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format',
        },
        task: {
          type: 'string',
          description: 'Task ID to associate with the time record',
        },
        project: {
          type: 'string',
          description: 'Project ID to associate with the time record',
        },
        comment: {
          type: 'string',
          description: 'Optional comment for the time record',
        },
      },
      required: ['time', 'date'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const params = CreateTimeRecordSchema.parse(args);
      
      try {
        // Convert time to seconds if it's a string
        const timeInSeconds = typeof params.time === 'string' 
          ? client.parseTimeToSeconds(params.time)
          : params.time;

        const createParams: CreateTimeRecordParams = {
          ...params,
          time: timeInSeconds,
        };
        
        const timeRecord = await client.createTimeRecord(createParams);
        
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
                message: `Time record created successfully: ${client.formatTime(timeRecord.time)} on ${timeRecord.date}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating time record: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_update_time_record: {
    name: 'everhour_update_time_record',
    description: 'Update an existing time record in Everhour. Time can be specified in seconds or human-readable format.',
    readonly: false,
    operationType: 'write',
    affectedResources: ['time'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Time record ID',
        },
        time: {
          type: ['number', 'string'],
          description: 'Time in seconds (number) or human-readable format (string like "1h 30m", "90m", "5400s")',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format',
        },
        task: {
          type: 'string',
          description: 'Task ID to associate with the time record',
        },
        project: {
          type: 'string',
          description: 'Project ID to associate with the time record',
        },
        comment: {
          type: 'string',
          description: 'Comment for the time record',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id, time, ...otherParams } = UpdateTimeRecordSchema.parse(args);
      
      try {
        // Convert time to seconds if it's provided as a string
        const timeInSeconds = time !== undefined && typeof time === 'string' 
          ? client.parseTimeToSeconds(time)
          : time;

        const updateParams: UpdateTimeRecordParams = {
          ...otherParams,
          time: timeInSeconds,
        };
        
        const timeRecord = await client.updateTimeRecord(id, updateParams);
        
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
                message: `Time record updated successfully: ${client.formatTime(timeRecord.time)} on ${timeRecord.date}`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error updating time record: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },

  everhour_delete_time_record: {
    name: 'everhour_delete_time_record',
    description: 'Delete a time record from Everhour. This action cannot be undone.',
    readonly: false,
    operationType: 'delete',
    affectedResources: ['time'],
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Time record ID',
        },
      },
      required: ['id'],
    },
    handler: async (client: EverHourApiClient, args: any) => {
      const { id } = DeleteTimeRecordSchema.parse(args);
      
      try {
        await client.deleteTimeRecord(id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Time record with ID "${id}" deleted successfully`,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting time record: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
};