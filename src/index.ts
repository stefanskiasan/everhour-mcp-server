#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { EverHourApiClient } from './api/everhour-client.js';
import { projectTools } from './tools/projects.js';
import { taskTools } from './tools/tasks.js';
import { taskExtensionTools } from './tools/task-extensions.js';
import { timeRecordTools } from './tools/time-records.js';
import { timerTools } from './tools/timers.js';
import { clientTools } from './tools/clients.js';
import { sectionTools } from './tools/sections.js';
import { userTools } from './tools/users.js';

// Configuration
interface Config {
  apiKey: string;
  baseUrl?: string;
}

function getConfig(): Config {
  const apiKey = process.env.EVERHOUR_API_KEY;
  
  if (!apiKey) {
    throw new Error('EVERHOUR_API_KEY environment variable is required');
  }
  
  return {
    apiKey,
    baseUrl: process.env.EVERHOUR_API_BASE_URL || 'https://api.everhour.com',
  };
}

// Create server instance
const server = new Server(
  {
    name: 'everhour-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Everhour API client
let apiClient: EverHourApiClient;

try {
  const config = getConfig();
  apiClient = new EverHourApiClient(config.apiKey, config.baseUrl);
} catch (error) {
  console.error('Failed to initialize Everhour API client:', error);
  process.exit(1);
}

// Combine all tools
const allTools = {
  ...projectTools,
  ...taskTools,
  ...taskExtensionTools,
  ...timeRecordTools,
  ...timerTools,
  ...clientTools,
  ...sectionTools,
  ...userTools,
};

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(allTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const tool = allTools[name as keyof typeof allTools];
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Tool "${name}" not found`);
    }
    
    const result = await tool.handler(apiClient, args || {});
    return result;
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new McpError(ErrorCode.InternalError, `Error executing tool "${name}": ${errorMessage}`);
  }
});

// Error handling
server.onerror = (error) => {
  console.error('[MCP Error]', error);
};

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Test connection on startup
  try {
    const isConnected = await apiClient.testConnection();
    if (!isConnected) {
      console.error('Failed to connect to Everhour API. Please check your API key.');
    } else {
      console.error('Successfully connected to Everhour API');
    }
  } catch (error) {
    console.error('Error testing Everhour API connection:', error);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});