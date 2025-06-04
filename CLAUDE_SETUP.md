# Claude Desktop Setup for Hyperliquid MCP

## Quick Setup with MCP CLI (Recommended)

The easiest way to install the Hyperliquid MCP server is using the MCP CLI tool:

### 1. Install MCP CLI globally

```bash
npm install -g @aurracloud/mcp-cli
```

### 2. Install Hyperliquid MCP Server

```bash
# Install with Docker (recommended for security)
mcp install @aurracloud/hyperliquid-mcp -c claude

# Or install directly on host (if you prefer)
mcp install @aurracloud/hyperliquid-mcp -c claude --direct

# Install with environment variables
mcp install @aurracloud/hyperliquid-mcp -c claude --args HYPERLIQUID_TESTNET=false DEBUG=false
```

### 3. Restart Claude Desktop

After installation, restart Claude Desktop to load the new MCP server.

### 4. Verify Installation

```bash
# List all installed MCP servers
mcp list -c claude

# Get information about the Hyperliquid MCP server
mcp info @aurracloud/hyperliquid-mcp
```

## Manual Setup (Alternative)

If you prefer manual configuration, add this to your Claude Desktop configuration file:

### macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`
### Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hyperliquid": {
      "command": "npx",
      "args": ["@aurracloud/hyperliquid-mcp/dist/index.js"],
      "env": {
        "HYPERLIQUID_TESTNET": "false"
      }
    }
  }
}
```

## Environment Variables

- `HYPERLIQUID_TESTNET`: Set to `"true"` to use testnet, `"false"` for mainnet (default: `"false"`)
- `DEBUG`: Set to `"true"` to enable debug logging (optional)

## Available Tools

The server provides 19 tools for interacting with Hyperliquid:

### Trader Data
- `HYPERLIQUID_getTraderPositions` - Get all positions for a trader
- `HYPERLIQUID_getTraderPositionForMarket` - Get position for specific market
- `HYPERLIQUID_getOpenOrders` - Get open orders
- `HYPERLIQUID_getUserFills` - Get trading history

### Market Data
- `HYPERLIQUID_getMarkets` - Get all available markets
- `HYPERLIQUID_getMarketPrice` - Get current price for a market
- `HYPERLIQUID_getMeta` - Get exchange meta information
- `HYPERLIQUID_getAllMids` - Get all current mid prices

### Funding Rates
- `HYPERLIQUID_getFundingRates` - Get funding rates for all markets
- `HYPERLIQUID_getPredictedFundings` - Get predicted funding rates
- `HYPERLIQUID_getMarketFundingRate` - Get funding rate for specific market
- `HYPERLIQUID_getNextFundingTime` - Get next funding time

### Vault Operations
- `HYPERLIQUID_getVaultDetails` - Get vault information
- `HYPERLIQUID_getUserVaultEquities` - Get user's vault deposits
- `HYPERLIQUID_getUserSubAccounts` - Get user's subaccounts
- `HYPERLIQUID_calculateVaultMetrics` - Calculate vault performance metrics
- `HYPERLIQUID_getVaultPortfolioData` - Get vault portfolio data
- `HYPERLIQUID_isValidVaultAddress` - Validate vault address
- `HYPERLIQUID_getVaultStrategies` - Get vault strategies

## Management Commands

### Uninstall

```bash
# Remove the Hyperliquid MCP server
mcp uninstall @aurracloud/hyperliquid-mcp -c claude
```

### Update

```bash
# Uninstall and reinstall to get the latest version
mcp uninstall @aurracloud/hyperliquid-mcp -c claude
mcp install @aurracloud/hyperliquid-mcp -c claude
```

## Automation & Scripting

For automated setups, use JSON mode:

```bash
# Install with JSON output for automation
mcp install @aurracloud/hyperliquid-mcp -c claude --json --args HYPERLIQUID_TESTNET=false

# Check installation status programmatically
mcp info @aurracloud/hyperliquid-mcp --json
```

## Testing

You can test the server directly:

```bash
cd /<path_to_package>/@aurracloud/hyperliquid-mcp
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js
```

## Troubleshooting

### Server Not Loading
1. Verify installation: `mcp list -c claude`
2. Check Claude Desktop configuration file exists
3. Restart Claude Desktop completely
4. Check for any error messages in Claude Desktop

### Environment Variables Not Working
- Use the `--args` flag during installation: `mcp install @aurracloud/hyperliquid-mcp -c claude --args HYPERLIQUID_TESTNET=true`
- Or manually edit the configuration file after installation

### Docker Issues
- If Docker installation fails, try direct installation: `mcp install @aurracloud/hyperliquid-mcp -c claude --direct`
- Ensure Docker is running if using the default Docker installation 