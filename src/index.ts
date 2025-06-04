#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerHyperliquidMcpTools } from './mcp-tools.js';

async function main() {
  // Create MCP server
  const server = new McpServer(
    {
      name: "hyperliquid-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register Hyperliquid tools
  registerHyperliquidMcpTools(server);

  // Create stdio transport
  const transport = new StdioServerTransport();
  
  // Connect server to transport
  await server.connect(transport);
  
  console.error("Hyperliquid MCP Server running on stdio");
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error("Shutting down Hyperliquid MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down Hyperliquid MCP Server...");
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Failed to start Hyperliquid MCP Server:", error);
  process.exit(1);
}); 