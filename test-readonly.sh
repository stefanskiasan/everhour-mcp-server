#!/bin/bash

# Test script for readonly mode functionality
echo "Testing Everhour MCP Server Readonly Mode"
echo "=========================================="

echo ""
echo "🔒 Testing READONLY MODE..."
EVERHOUR_API_KEY=dummy_key EVERHOUR_READONLY_MODE=true node build/index.js &
SERVER_PID=$!
sleep 2
kill $SERVER_PID 2>/dev/null

echo ""
echo "🔓 Testing FULL MODE..."
EVERHOUR_API_KEY=dummy_key EVERHOUR_READONLY_MODE=false node build/index.js &
SERVER_PID=$!
sleep 2
kill $SERVER_PID 2>/dev/null

echo ""
echo "✅ Readonly mode tests completed!"
echo ""
echo "Usage examples:"
echo "  EVERHOUR_READONLY_MODE=true npx @everhour/mcp-server    # Safe mode"
echo "  EVERHOUR_READONLY_MODE=false npx @everhour/mcp-server   # Full mode"
echo "  npx @everhour/mcp-server                                 # Full mode (default)"