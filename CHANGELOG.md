# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-12-XX

### 🎉 Major Release - Complete API Coverage

This version represents a complete rewrite and expansion of the Everhour MCP server with 100% API endpoint coverage.

### ✨ Added

#### New Tool Categories
- **User & Team Management (3 tools)**
  - `everhour_get_current_user` - Get current user profile
  - `everhour_list_team_users` - List all team users  
  - `everhour_get_user` - Get specific team user details

- **Extended Task Management (6 new tools)**
  - `everhour_get_tasks_for_project` - Get all tasks for specific project
  - `everhour_update_task_estimate` - Update task estimates
  - `everhour_delete_task_estimate` - Delete task estimates
  - `everhour_add_time_to_task` - Add time directly to tasks
  - `everhour_update_task_time` - Update task time records
  - `everhour_delete_task_time` - Delete time from tasks

- **Complete Section Management (5 tools)**
  - `everhour_list_all_sections` - List all sections globally
  - `everhour_create_section` - Create new sections
  - `everhour_update_section` - Update section details
  - `everhour_delete_section` - Delete sections
  - Enhanced `everhour_get_section` with full details

- **Advanced Timer Features (3 new tools)**
  - `everhour_get_running_timer` - Alternative running timer endpoint
  - `everhour_start_timer_for_task` - Start timer directly for specific task
  - Enhanced timer status and management

#### API Improvements
- **100% Endpoint Coverage**: All 37 available Everhour API endpoints implemented
- **Corrected Timer Endpoints**: Updated to use official `/timer` instead of `/timers`
- **Enhanced Type Safety**: Comprehensive TypeScript interfaces for all API responses
- **Improved Input Validation**: Zod schemas for all tool inputs with detailed error messages

#### Developer Experience
- **NPX Support**: Can now be run with `npx @everhour/mcp-server`
- **Professional Package Structure**: Proper npm package configuration
- **Comprehensive Documentation**: API coverage report, contributing guidelines, examples
- **CLI Executable**: Direct command-line usage support

### 🔧 Changed

#### API Endpoints
- **Timer APIs**: Updated from `/timers/*` to `/timer/*` to match official documentation
- **User APIs**: Proper implementation of `/me` and `/users` endpoints
- **Section APIs**: Complete CRUD operations instead of read-only

#### Tool Interface
- **Consistent Naming**: All tools follow `everhour_*` naming convention
- **Enhanced Responses**: More detailed and formatted JSON responses
- **Better Error Handling**: Comprehensive error messages with context

#### Documentation
- **Complete Rewrite**: Professional README with installation and usage examples
- **API Coverage Report**: Detailed mapping of all implemented endpoints
- **Contributing Guidelines**: Comprehensive contributor documentation
- **License**: MIT license for open source usage

### 🚀 Technical Improvements

- **TypeScript**: Full type safety across entire codebase
- **Error Handling**: Robust error handling with graceful fallbacks
- **Input Validation**: Comprehensive validation using Zod schemas
- **Time Format Support**: Human-readable time formats (\"2h 30m\", \"90m\", etc.)
- **Connection Testing**: Automatic API connection validation on startup
- **Rate Limiting**: Respect for Everhour API rate limits

### 📊 Statistics

- **Total Tools**: 37 (increased from 20)
- **API Coverage**: 100% (all documented endpoints)
- **New Features**: 17 additional tools
- **Documentation Pages**: 6 comprehensive guides
- **Type Definitions**: Complete TypeScript coverage

## [1.0.0] - 2024-XX-XX

### 🎉 Initial Release

#### ✨ Added

**Core MCP Server**
- Model Context Protocol server implementation
- Everhour API integration
- TypeScript implementation with full type safety

**Project Management (5 tools)**
- `everhour_list_projects` - List all projects
- `everhour_get_project` - Get project details
- `everhour_create_project` - Create new project
- `everhour_update_project` - Update project
- `everhour_delete_project` - Delete project

**Task Management (5 tools)**
- `everhour_list_tasks` - List tasks
- `everhour_get_task` - Get task details
- `everhour_create_task` - Create new task
- `everhour_update_task` - Update task
- `everhour_delete_task` - Delete task

**Time Tracking (5 tools)**
- `everhour_list_time_records` - List time records
- `everhour_get_time_record` - Get time record details
- `everhour_create_time_record` - Create time record
- `everhour_update_time_record` - Update time record
- `everhour_delete_time_record` - Delete time record

**Timer Management (3 tools)**
- `everhour_get_current_timer` - Get current timer
- `everhour_start_timer` - Start timer
- `everhour_stop_timer` - Stop timer

**Client Management (5 tools)**
- `everhour_list_clients` - List clients
- `everhour_get_client` - Get client details
- `everhour_create_client` - Create client
- `everhour_update_client` - Update client
- `everhour_delete_client` - Delete client

#### 🔧 Features

- Basic error handling
- Input validation
- Environment variable configuration
- Human-readable time format support
- Comprehensive documentation

---

## Version Comparison

| Feature | v1.0.0 | v2.0.0 |
|---------|--------|--------|
| **Total Tools** | 20 | 37 |
| **API Coverage** | ~60% | 100% |
| **Timer Management** | Basic | Advanced |
| **Task Features** | Basic CRUD | Extended with estimates & time |
| **Section Management** | None | Complete CRUD |
| **User Management** | None | Complete |
| **NPX Support** | No | Yes |
| **Documentation** | Basic | Comprehensive |
| **Type Safety** | Partial | Complete |

## Migration Guide

### From v1.x to v2.x

#### Breaking Changes
- **Package Name**: Changed from `everhour-mcp-server` to `@everhour/mcp-server`
- **Timer Endpoints**: Timer APIs use correct `/timer` endpoints (may affect existing integrations)

#### New Features Available
- Use new task estimate management tools
- Leverage section management for better project organization
- Access user and team management features
- Utilize direct task time logging capabilities

#### Installation Update
```bash
# Old way
npm install everhour-mcp-server

# New way  
npx @everhour/mcp-server
```

#### Configuration Update
```json
{
  "mcpServers": {
    "everhour": {
      "command": "npx",
      "args": ["@everhour/mcp-server"],
      "env": {
        "EVERHOUR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

For detailed information about any version, see the [API Coverage Report](./API_COVERAGE.md) and [Examples Guide](./examples.md).