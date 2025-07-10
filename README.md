# @everhour/mcp-server

[![npm version](https://badge.fury.io/js/%40everhour%2Fmcp-server.svg)](https://badge.fury.io/js/%40everhour%2Fmcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Complete Everhour API integration for Model Context Protocol (MCP) with 100% endpoint coverage**

A comprehensive MCP server that provides seamless integration with the Everhour API, enabling AI assistants like Claude to manage time tracking, projects, tasks, and team productivity workflows.

## 🚀 Quick Start

### Installation

```bash
# Using npx (recommended)
npx @everhour/mcp-server

# Or install globally
npm install -g @everhour/mcp-server
everhour-mcp-server
```

### Prerequisites

- **Node.js 18+**
- **Everhour account** with paid plan (API access required)
- **Everhour API key** (get it from [Everhour Settings → My Profile](https://app.everhour.com/#/account/profile))

### Configuration

Set your Everhour API key as an environment variable:

```bash
export EVERHOUR_API_KEY=\"your_api_key_here\"
```

## 📋 MCP Client Setup

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  \"mcpServers\": {
    \"everhour\": {
      \"command\": \"npx\",
      \"args\": [\"@everhour/mcp-server\"],
      \"env\": {
        \"EVERHOUR_API_KEY\": \"your_api_key_here\"
      }
    }
  }
}
```

### Other MCP Clients

For other MCP-compatible clients, use:

```bash
# Command
npx @everhour/mcp-server

# Environment Variables
EVERHOUR_API_KEY=your_api_key_here
```

## ✨ Features

### 🎯 **100% API Coverage**
All 37 available Everhour API endpoints implemented as MCP tools

### 🛠 **Complete Functionality**
- **Project Management**: Create, update, list, and delete projects
- **Task Management**: Full CRUD operations with estimates and time logging
- **Time Tracking**: Comprehensive time record management
- **Timer Control**: Start, stop, and monitor active timers
- **Client Management**: Manage clients and business details
- **Section Organization**: Project section management
- **Team Collaboration**: User and team member management

### 🔧 **Developer-Friendly**
- **TypeScript**: Full type safety and IntelliSense support
- **Input Validation**: Comprehensive validation with detailed error messages
- **Human-Readable**: Time formats like \"2h 30m\" alongside seconds
- **Error Handling**: Graceful error handling with helpful messages

## 🔧 Available Tools (37 total)

<details>
<summary><strong>Projects (5 tools)</strong></summary>

- `everhour_list_projects` - List all projects with filtering options
- `everhour_get_project` - Get details of a specific project
- `everhour_create_project` - Create a new project
- `everhour_update_project` - Update project details
- `everhour_delete_project` - Delete a project

</details>

<details>
<summary><strong>Tasks (11 tools)</strong></summary>

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

</details>

<details>
<summary><strong>Time Records (5 tools)</strong></summary>

- `everhour_list_time_records` - List time records with date/project filtering
- `everhour_get_time_record` - Get details of a specific time record
- `everhour_create_time_record` - Log time (supports human-readable formats)
- `everhour_update_time_record` - Update existing time records
- `everhour_delete_time_record` - Delete a time record

</details>

<details>
<summary><strong>Timers (7 tools)</strong></summary>

**Core Timer Functions:**
- `everhour_get_current_timer` - Get the currently running timer
- `everhour_start_timer` - Start a new timer
- `everhour_stop_timer` - Stop the current timer
- `everhour_list_timers` - List timer history
- `everhour_timer_status` - Get timer status summary

**Extended Timer Features:**
- `everhour_get_running_timer` - Get running timer (alternative endpoint)
- `everhour_start_timer_for_task` - Start timer directly for specific task

</details>

<details>
<summary><strong>Clients (5 tools)</strong></summary>

- `everhour_list_clients` - List all clients
- `everhour_get_client` - Get details of a specific client
- `everhour_create_client` - Create a new client
- `everhour_update_client` - Update client details
- `everhour_delete_client` - Delete a client

</details>

<details>
<summary><strong>Sections (5 tools)</strong></summary>

- `everhour_list_all_sections` - List all sections (global search)
- `everhour_get_section` - Get details of a specific section
- `everhour_create_section` - Create a new section
- `everhour_update_section` - Update section details
- `everhour_delete_section` - Delete a section

</details>

<details>
<summary><strong>Users & Team Management (3 tools)</strong></summary>

- `everhour_get_current_user` - Get current user profile
- `everhour_list_team_users` - List all team users
- `everhour_get_user` - Get details of a specific team user

</details>

## 📚 Examples

### Starting a Timer

```json
{
  \"tool\": \"everhour_start_timer_for_task\",
  \"arguments\": {
    \"taskId\": \"task_123\",
    \"comment\": \"Working on user authentication feature\"
  }
}
```

### Logging Time

```json
{
  \"tool\": \"everhour_create_time_record\",
  \"arguments\": {
    \"time\": \"2h 30m\",
    \"date\": \"2024-01-15\",
    \"task\": \"task_123\",
    \"comment\": \"Implemented login functionality and wrote tests\"
  }
}
```

### Creating a Project

```json
{
  \"tool\": \"everhour_create_project\",
  \"arguments\": {
    \"name\": \"Mobile App Development\",
    \"client\": 456,
    \"type\": \"board\",
    \"billing\": {
      \"type\": \"hourly_rate\",
      \"rate\": 85.00
    }
  }
}
```

### Getting Project Tasks

```json
{
  \"tool\": \"everhour_get_tasks_for_project\",
  \"arguments\": {
    \"projectId\": \"proj_789\",
    \"status\": \"open\"
  }
}
```

## 🕐 Time Format Support

The server supports flexible time input formats:

- **Human-readable**: `\"2h 30m\"`, `\"90m\"`, `\"1h 30m 45s\"`
- **Minutes only**: `\"90m\"` (90 minutes)
- **Seconds**: `3600` (1 hour in seconds)

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EVERHOUR_API_KEY` | ✅ Yes | - | Your Everhour API key |
| `EVERHOUR_API_BASE_URL` | ❌ No | `https://api.everhour.com` | API base URL |
| `EVERHOUR_READONLY_MODE` | ❌ No | `false` | Enable readonly mode for safety |

## 🔒 Readonly Mode

**Readonly mode** provides an additional security layer by blocking all write and delete operations, allowing only safe read operations.

### When to Use Readonly Mode

- **Production environments** where data integrity is critical
- **Reporting and analytics** use cases
- **Shared or untrusted environments**
- **Testing and development** with live data
- **Compliance requirements** for read-only access

### Enabling Readonly Mode

```bash
# Via environment variable
EVERHOUR_READONLY_MODE=true npx @everhour/mcp-server

# Or export for session
export EVERHOUR_READONLY_MODE=true
npx @everhour/mcp-server
```

### Claude Desktop Readonly Configuration

```json
{
  "mcpServers": {
    "everhour-readonly": {
      "command": "npx",
      "args": ["@everhour/mcp-server"],
      "env": {
        "EVERHOUR_API_KEY": "your_api_key_here",
        "EVERHOUR_READONLY_MODE": "true"
      }
    }
  }
}
```

### What's Blocked in Readonly Mode

- ❌ **Creating**: Projects, tasks, clients, sections, time records
- ❌ **Updating**: Any modifications to existing data
- ❌ **Deleting**: Removal of any resources
- ❌ **Timer Control**: Starting/stopping timers
- ❌ **Time Logging**: Adding or modifying time entries

### What's Allowed in Readonly Mode

- ✅ **Listing**: All list operations (`everhour_list_*`)
- ✅ **Reading**: All get operations (`everhour_get_*`)
- ✅ **Status Checks**: Timer status, user information
- ✅ **Searching**: Project, task, and client searches
- ✅ **Reports**: Time record queries and analytics

### Readonly Mode Status

When the server starts, it will log the current mode:

```
🔒 EVERHOUR MCP SERVER - READONLY MODE ACTIVE
   Available tools: 19/37
   Blocked tools: 18 (write/delete operations)
   To enable full mode: Set EVERHOUR_READONLY_MODE=false
```

Or in full mode:

```
🔓 EVERHOUR MCP SERVER - FULL MODE ACTIVE
   All 37 tools available
   To enable readonly mode: Set EVERHOUR_READONLY_MODE=true
```

## 📖 Documentation

- **[API Coverage Report](./API_COVERAGE.md)** - Complete endpoint mapping
- **[Examples Guide](./examples.md)** - Comprehensive usage examples
- **[Official Everhour API](https://everhour.docs.apiary.io/)** - Official API documentation

## 🛠 Development

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/everhour-mcp-server.git
cd everhour-mcp-server

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API key

# Development mode
npm run dev

# Build
npm run build

# Run built version
npm start
```

### Project Structure

```
src/
├── api/
│   └── everhour-client.ts    # Everhour API client
├── tools/
│   ├── clients.ts            # Client management tools
│   ├── projects.ts           # Project management tools
│   ├── tasks.ts              # Task management tools
│   ├── task-extensions.ts    # Extended task features
│   ├── time-records.ts       # Time record tools
│   ├── timers.ts             # Timer control tools
│   ├── sections.ts           # Section management tools
│   └── users.ts              # User management tools
├── types/
│   └── everhour.ts           # TypeScript type definitions
└── index.ts                  # MCP server entry point
```

### Scripts

- `npm run dev` - Development mode with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start the built server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run clean` - Clean build directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **[npm Package](https://www.npmjs.com/package/@everhour/mcp-server)**
- **[GitHub Repository](https://github.com/yourusername/everhour-mcp-server)**
- **[Everhour Official Site](https://everhour.com)**
- **[Model Context Protocol](https://modelcontextprotocol.io/)**

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/everhour-mcp-server/issues)
- **Everhour API**: [Official Documentation](https://everhour.docs.apiary.io/)
- **MCP Protocol**: [MCP Documentation](https://modelcontextprotocol.io/)

## 🏆 Features

- ✅ **Complete API Coverage** - All 37 Everhour endpoints
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Input Validation** - Comprehensive validation with Zod
- ✅ **Error Handling** - Graceful error handling
- ✅ **Human-Readable** - Time formats and clear responses
- ✅ **Well-Documented** - Extensive documentation and examples
- ✅ **Production-Ready** - Robust and reliable implementation

---

Made with ❤️ for the Model Context Protocol community