# Everhour MCP Server

A Model Context Protocol (MCP) server that provides comprehensive integration with the Everhour API for time tracking, project management, and productivity workflows.

## Features

- **Project Management**: List, create, update, and delete projects
- **Task Management**: Full CRUD operations for tasks
- **Time Tracking**: Create, update, and manage time records
- **Timer Control**: Start, stop, and monitor active timers
- **Client Management**: Manage clients and their business details
- **Rich Data**: Formatted time displays and comprehensive project/task information

## Prerequisites

- Node.js 18 or higher
- Everhour account with API access (requires paid plan)
- Everhour API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd everhour-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your Everhour API key
```

4. Build the project:
```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
EVERHOUR_API_KEY=your_everhour_api_key_here

# Optional
EVERHOUR_API_BASE_URL=https://api.everhour.com
```

### Getting Your API Key

1. Log into your Everhour account
2. Go to Settings > API
3. Generate a new API key
4. Copy the key to your `.env` file

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### MCP Integration

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "everhour": {
      "command": "node",
      "args": ["/path/to/everhour-mcp-server/build/index.js"],
      "env": {
        "EVERHOUR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools (37 total)

### Projects (5 tools)

- `everhour_list_projects` - List all projects with filtering options
- `everhour_get_project` - Get details of a specific project
- `everhour_create_project` - Create a new project
- `everhour_update_project` - Update project details
- `everhour_delete_project` - Delete a project

### Tasks (11 tools)

**Core Task Management:**
- `everhour_list_tasks` - List tasks with filtering by project, status, assignee
- `everhour_get_task` - Get details of a specific task
- `everhour_create_task` - Create a new task
- `everhour_update_task` - Update task details
- `everhour_delete_task` - Delete a task

**Extended Task Features:**
- `everhour_get_tasks_for_project` - Get all tasks for specific project
- `everhour_update_task_estimate` - Update task estimate
- `everhour_delete_task_estimate` - Delete task estimate
- `everhour_add_time_to_task` - Add time directly to task
- `everhour_update_task_time` - Update task time
- `everhour_delete_task_time` - Delete time from task

### Time Records (5 tools)

- `everhour_list_time_records` - List time records with date/project filtering
- `everhour_get_time_record` - Get details of a specific time record
- `everhour_create_time_record` - Log time (supports human-readable formats)
- `everhour_update_time_record` - Update existing time records
- `everhour_delete_time_record` - Delete a time record

### Timers (7 tools)

**Core Timer Functions:**
- `everhour_get_current_timer` - Get the currently running timer
- `everhour_start_timer` - Start a new timer
- `everhour_stop_timer` - Stop the current timer
- `everhour_list_timers` - List timer history
- `everhour_timer_status` - Get timer status summary

**Extended Timer Features:**
- `everhour_get_running_timer` - Get running timer (alternative endpoint)
- `everhour_start_timer_for_task` - Start timer directly for specific task

### Clients (5 tools)

- `everhour_list_clients` - List all clients
- `everhour_get_client` - Get details of a specific client
- `everhour_create_client` - Create a new client
- `everhour_update_client` - Update client details
- `everhour_delete_client` - Delete a client

### Sections (5 tools)

- `everhour_list_all_sections` - List all sections (global search)
- `everhour_get_section` - Get details of a specific section
- `everhour_create_section` - Create a new section
- `everhour_update_section` - Update section details
- `everhour_delete_section` - Delete a section

### Users & Team Management (3 tools)

- `everhour_get_current_user` - Get current user profile
- `everhour_list_team_users` - List all team users
- `everhour_get_user` - Get details of a specific team user

## Examples

### Starting a Timer

```json
{
  "tool": "everhour_start_timer",
  "arguments": {
    "task": "task_id_here",
    "comment": "Working on feature implementation"
  }
}
```

### Logging Time

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": "2h 30m",
    "date": "2024-01-15",
    "task": "task_id_here",
    "comment": "Code review and testing"
  }
}
```

### Creating a Project

```json
{
  "tool": "everhour_create_project",
  "arguments": {
    "name": "Website Redesign",
    "client": 123,
    "type": "board",
    "billing": {
      "type": "hourly_rate",
      "rate": 75.00
    }
  }
}
```

### Listing Tasks

```json
{
  "tool": "everhour_list_tasks",
  "arguments": {
    "project": "project_id_here",
    "status": "open",
    "assignee": 456
  }
}
```

## Time Format Support

The server supports flexible time input formats:

- **Seconds**: `3600` (1 hour)
- **Minutes**: `90m` (1 hour 30 minutes)
- **Hours and Minutes**: `2h 30m` (2 hours 30 minutes)
- **Full Format**: `1h 30m 45s` (1 hour 30 minutes 45 seconds)

## Error Handling

The server includes comprehensive error handling:

- **Input Validation**: All inputs are validated using Zod schemas
- **API Error Handling**: Everhour API errors are properly caught and formatted
- **Network Errors**: Connection issues are handled gracefully
- **Authentication**: Invalid API keys are detected and reported

## API Rate Limiting

The server respects Everhour's API rate limits. If you encounter rate limiting:

1. Reduce the frequency of requests
2. Use pagination for large datasets
3. Filter requests to reduce data transfer

## Development

### Scripts

- `npm run dev` - Development mode with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start the built server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── api/
│   └── everhour-client.ts    # Everhour API client
├── tools/
│   ├── clients.ts            # Client management tools
│   ├── projects.ts           # Project management tools
│   ├── tasks.ts              # Task management tools
│   ├── time-records.ts       # Time record tools
│   └── timers.ts             # Timer control tools
├── types/
│   └── everhour.ts           # TypeScript type definitions
└── index.ts                  # MCP server entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **Everhour API**: Check the [Everhour API documentation](https://everhour.docs.apiary.io/)
- **MCP Protocol**: See the [MCP documentation](https://modelcontextprotocol.io/)

## Changelog

### v2.0.0 (Latest)
- **COMPLETE Everhour API Coverage**: All 37 available endpoints implemented
- **Extended Task Management**: Task estimates, direct time logging to tasks
- **Advanced Timer Features**: Multiple timer endpoints, task-specific timer start
- **Full Section Management**: CRUD operations for project sections
- **User/Team Management**: Current user profile, team member listing
- **Corrected API Endpoints**: Updated to use official Everhour API paths
- **Enhanced Documentation**: Comprehensive examples and endpoint reference

### v1.0.0
- Initial release
- Basic Everhour API integration
- Support for projects, tasks, time records, timers, and clients
- Comprehensive error handling and validation
- Human-readable time format support