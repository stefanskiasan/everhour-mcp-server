# Everhour MCP Server - Usage Examples

This document provides comprehensive examples of how to use the Everhour MCP server tools.

## Getting Started

First, make sure you have the MCP server running and configured with your Everhour API key.

## Project Management

### List All Projects

```json
{
  "tool": "everhour_list_projects",
  "arguments": {}
}
```

### List Active Projects Only

```json
{
  "tool": "everhour_list_projects",
  "arguments": {
    "status": "active"
  }
}
```

### Search Projects by Name

```json
{
  "tool": "everhour_list_projects",
  "arguments": {
    "query": "website"
  }
}
```

### Get Project Details

```json
{
  "tool": "everhour_get_project",
  "arguments": {
    "id": "project_id_here"
  }
}
```

### Create a New Project

```json
{
  "tool": "everhour_create_project",
  "arguments": {
    "name": "Mobile App Development",
    "client": 123,
    "type": "board",
    "billing": {
      "type": "hourly_rate",
      "rate": 85.00,
      "budget": 10000
    }
  }
}
```

### Update Project Status

```json
{
  "tool": "everhour_update_project",
  "arguments": {
    "id": "project_id_here",
    "status": "completed"
  }
}
```

## Task Management

### List All Tasks in a Project

```json
{
  "tool": "everhour_list_tasks",
  "arguments": {
    "project": "project_id_here"
  }
}
```

### List Open Tasks Assigned to User

```json
{
  "tool": "everhour_list_tasks",
  "arguments": {
    "status": "open",
    "assignee": 456
  }
}
```

### Search Tasks by Name

```json
{
  "tool": "everhour_list_tasks",
  "arguments": {
    "query": "login feature"
  }
}
```

### Create a New Task

```json
{
  "tool": "everhour_create_task",
  "arguments": {
    "name": "Implement user authentication",
    "project": "project_id_here",
    "type": "feature",
    "assignee": 456,
    "description": "Add login/logout functionality with JWT tokens",
    "labels": ["frontend", "backend", "security"]
  }
}
```

### Update Task Status

```json
{
  "tool": "everhour_update_task",
  "arguments": {
    "id": "task_id_here",
    "status": "in_progress"
  }
}
```

### Mark Task as Complete

```json
{
  "tool": "everhour_update_task",
  "arguments": {
    "id": "task_id_here",
    "status": "closed"
  }
}
```

## Time Tracking

### Log Time for a Task

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": "2h 30m",
    "date": "2024-01-15",
    "task": "task_id_here",
    "comment": "Implemented user registration flow"
  }
}
```

### Log Time with Different Formats

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": "90m",
    "date": "2024-01-15",
    "project": "project_id_here",
    "comment": "Code review and testing"
  }
}
```

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": 3600,
    "date": "2024-01-15",
    "task": "task_id_here",
    "comment": "Bug fixes and documentation"
  }
}
```

### List Time Records for Today

```json
{
  "tool": "everhour_list_time_records",
  "arguments": {
    "from": "2024-01-15",
    "to": "2024-01-15"
  }
}
```

### List Time Records for a Project

```json
{
  "tool": "everhour_list_time_records",
  "arguments": {
    "project": "project_id_here",
    "from": "2024-01-01",
    "to": "2024-01-31"
  }
}
```

### Update Time Record

```json
{
  "tool": "everhour_update_time_record",
  "arguments": {
    "id": "time_record_id_here",
    "time": "3h",
    "comment": "Updated: Added unit tests"
  }
}
```

## Timer Management

### Check Current Timer Status

```json
{
  "tool": "everhour_get_current_timer",
  "arguments": {}
}
```

### Start Timer for a Task

```json
{
  "tool": "everhour_start_timer",
  "arguments": {
    "task": "task_id_here",
    "comment": "Working on API integration"
  }
}
```

### Start Timer for a Project

```json
{
  "tool": "everhour_start_timer",
  "arguments": {
    "project": "project_id_here",
    "comment": "General project work"
  }
}
```

### Stop Current Timer

```json
{
  "tool": "everhour_stop_timer",
  "arguments": {}
}
```

### Get Timer Status Summary

```json
{
  "tool": "everhour_timer_status",
  "arguments": {}
}
```

### List Recent Timers

```json
{
  "tool": "everhour_list_timers",
  "arguments": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  }
}
```

## Client Management

### List All Clients

```json
{
  "tool": "everhour_list_clients",
  "arguments": {}
}
```

### Search Clients by Name

```json
{
  "tool": "everhour_list_clients",
  "arguments": {
    "query": "acme"
  }
}
```

### Get Client Details

```json
{
  "tool": "everhour_get_client",
  "arguments": {
    "id": 123
  }
}
```

### Create a New Client

```json
{
  "tool": "everhour_create_client",
  "arguments": {
    "name": "Acme Corporation",
    "businessDetails": {
      "name": "Acme Corp LLC",
      "address": "123 Business St, City, State 12345",
      "phone": "+1-555-123-4567",
      "website": "https://acme.com"
    }
  }
}
```

### Update Client Information

```json
{
  "tool": "everhour_update_client",
  "arguments": {
    "id": 123,
    "businessDetails": {
      "phone": "+1-555-987-6543",
      "website": "https://acme.corp"
    }
  }
}
```

## Common Workflows

### Daily Time Tracking Workflow

1. **Check current timer status**
```json
{
  "tool": "everhour_timer_status",
  "arguments": {}
}
```

2. **Start timer for morning task**
```json
{
  "tool": "everhour_start_timer",
  "arguments": {
    "task": "morning_task_id",
    "comment": "Morning development work"
  }
}
```

3. **Stop timer for lunch**
```json
{
  "tool": "everhour_stop_timer",
  "arguments": {}
}
```

4. **Start timer for afternoon task**
```json
{
  "tool": "everhour_start_timer",
  "arguments": {
    "task": "afternoon_task_id",
    "comment": "Afternoon testing and documentation"
  }
}
```

5. **Check daily time summary**
```json
{
  "tool": "everhour_list_time_records",
  "arguments": {
    "from": "2024-01-15",
    "to": "2024-01-15"
  }
}
```

### Project Setup Workflow

1. **Create client**
```json
{
  "tool": "everhour_create_client",
  "arguments": {
    "name": "New Client Inc."
  }
}
```

2. **Create project**
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

3. **Create initial tasks**
```json
{
  "tool": "everhour_create_task",
  "arguments": {
    "name": "Project kickoff meeting",
    "project": "project_id_here",
    "type": "task"
  }
}
```

### Weekly Reporting Workflow

1. **Get project time summary**
```json
{
  "tool": "everhour_list_time_records",
  "arguments": {
    "project": "project_id_here",
    "from": "2024-01-08",
    "to": "2024-01-14"
  }
}
```

2. **List completed tasks**
```json
{
  "tool": "everhour_list_tasks",
  "arguments": {
    "project": "project_id_here",
    "status": "closed"
  }
}
```

3. **Check project progress**
```json
{
  "tool": "everhour_get_project",
  "arguments": {
    "id": "project_id_here"
  }
}
```

## Error Handling Examples

### Invalid Time Format

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": "invalid_time",
    "date": "2024-01-15"
  }
}
```
**Result**: Error message about invalid time format

### Missing Required Fields

```json
{
  "tool": "everhour_create_project",
  "arguments": {
    "client": 123
  }
}
```
**Result**: Error message about missing required "name" field

### Invalid Date Format

```json
{
  "tool": "everhour_create_time_record",
  "arguments": {
    "time": "2h",
    "date": "15/01/2024"
  }
}
```
**Result**: Error message about invalid date format (should be YYYY-MM-DD)

## Tips and Best Practices

1. **Time Formats**: Use human-readable formats like "2h 30m" for better readability
2. **Date Filtering**: Always use YYYY-MM-DD format for dates
3. **Pagination**: Use `limit` and `page` parameters for large datasets
4. **Search**: Use `query` parameter to filter results by name
5. **Error Handling**: Always check for errors in tool responses
6. **Timer Management**: Only one timer can be active at a time
7. **API Limits**: Be mindful of Everhour's API rate limits

## Sample Response Formats

### Project List Response

```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "Website Redesign",
      "status": "active",
      "client": {
        "id": 123,
        "name": "Acme Corp"
      },
      "type": "board",
      "billing": {
        "type": "hourly_rate",
        "rate": 75.00
      },
      "time": {
        "total": 7200,
        "today": 0,
        "week": 3600
      }
    }
  ],
  "total": 1
}
```

### Time Record Response

```json
{
  "timeRecord": {
    "id": "time_456",
    "comment": "Implemented user registration",
    "time": 9000,
    "timeFormatted": "2h 30m 0s",
    "date": "2024-01-15",
    "task": {
      "id": "task_789",
      "name": "User Authentication"
    },
    "project": {
      "id": "proj_123",
      "name": "Website Redesign"
    }
  }
}
```