import { MCPToolDefinition, ReadonlyConfig } from '../types/everhour.js';

/**
 * Readonly mode configuration and validation utilities
 */

export class ReadonlyMode {
  private config: ReadonlyConfig;

  constructor() {
    this.config = {
      enabled: this.isReadonlyModeEnabled(),
      allowedOperations: this.isReadonlyModeEnabled() ? ['read'] : ['read', 'write', 'delete'],
      blockedTools: [],
    };
  }

  /**
   * Check if readonly mode is enabled via environment variable
   */
  private isReadonlyModeEnabled(): boolean {
    const envValue = process.env.EVERHOUR_READONLY_MODE;
    return envValue === 'true' || envValue === '1' || envValue === 'yes';
  }

  /**
   * Get current readonly configuration
   */
  getConfig(): ReadonlyConfig {
    return { ...this.config };
  }

  /**
   * Check if a tool is allowed to execute in current mode
   */
  isToolAllowed(tool: MCPToolDefinition): boolean {
    // If readonly mode is disabled, all tools are allowed
    if (!this.config.enabled) {
      return true;
    }

    // In readonly mode, only read operations are allowed
    return tool.readonly === true && tool.operationType === 'read';
  }

  /**
   * Get blocked tools in current mode
   */
  getBlockedTools(allTools: Record<string, MCPToolDefinition>): string[] {
    if (!this.config.enabled) {
      return [];
    }

    return Object.keys(allTools).filter(toolName => !this.isToolAllowed(allTools[toolName]));
  }

  /**
   * Get allowed tools in current mode
   */
  getAllowedTools(allTools: Record<string, MCPToolDefinition>): string[] {
    return Object.keys(allTools).filter(toolName => this.isToolAllowed(allTools[toolName]));
  }

  /**
   * Create error message for blocked tool
   */
  createBlockedToolError(toolName: string, tool: MCPToolDefinition): string {
    const operation = tool.operationType.toUpperCase();
    const resources = tool.affectedResources.join(', ');
    
    return `🔒 READONLY MODE: Tool "${toolName}" is blocked.
    
Reason: This tool performs ${operation} operations on: ${resources}
Current mode: READONLY (only read operations allowed)

To enable this tool:
- Set EVERHOUR_READONLY_MODE=false
- Or remove the environment variable

Available readonly tools: Use 'everhour_list_*' and 'everhour_get_*' tools for data retrieval.`;
  }

  /**
   * Get status summary for logging/display
   */
  getStatusSummary(allTools: Record<string, MCPToolDefinition>): {
    mode: 'readonly' | 'full';
    allowedTools: number;
    blockedTools: number;
    totalTools: number;
  } {
    const totalTools = Object.keys(allTools).length;
    const allowedTools = this.getAllowedTools(allTools);
    const blockedTools = this.getBlockedTools(allTools);

    return {
      mode: this.config.enabled ? 'readonly' : 'full',
      allowedTools: allowedTools.length,
      blockedTools: blockedTools.length,
      totalTools,
    };
  }

  /**
   * Log readonly mode status
   */
  logStatus(allTools: Record<string, MCPToolDefinition>): void {
    const status = this.getStatusSummary(allTools);
    
    if (this.config.enabled) {
      console.error(`🔒 EVERHOUR MCP SERVER - READONLY MODE ACTIVE`);
      console.error(`   Available tools: ${status.allowedTools}/${status.totalTools}`);
      console.error(`   Blocked tools: ${status.blockedTools} (write/delete operations)`);
      console.error(`   To enable full mode: Set EVERHOUR_READONLY_MODE=false`);
    } else {
      console.error(`🔓 EVERHOUR MCP SERVER - FULL MODE ACTIVE`);
      console.error(`   All ${status.totalTools} tools available`);
      console.error(`   To enable readonly mode: Set EVERHOUR_READONLY_MODE=true`);
    }
  }
}

/**
 * Global readonly mode instance
 */
export const readonlyMode = new ReadonlyMode();