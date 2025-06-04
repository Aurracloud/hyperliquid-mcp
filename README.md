# Hyperliquid MCP Server

A Model Context Protocol (MCP) server for Hyperliquid API integration. This server provides tools for querying Hyperliquid perpetual trading data including positions, trades, vaults, funding rates, and real-time market information.

## Features

### Trader & Position Tools
- **Get Trader Positions**: Retrieve all positions for a specific trader
- **Get Position for Market**: Get a trader's position for a specific market/coin
- **Get Open Orders**: Retrieve open orders for a trader
- **Get User Fills**: Get trading history (fills) for a user

### Market Data Tools
- **Get Markets**: List all available markets/assets on Hyperliquid
- **Get Market Price**: Get current price for a specific market
- **Get Meta Information**: Retrieve meta information about the exchange
- **Get All Mid Prices**: Get all current mid prices

### Funding Rate Tools
- **Get Funding Rates**: Retrieve funding rates for all markets
- **Get Predicted Fundings**: Get predicted funding rates
- **Get Market Funding Rate**: Get funding rate for a specific market
- **Get Next Funding Time**: Get next funding time for a specific market

### Vault Tools
- **Get Vault Details**: Get detailed information about a specific vault
- **Get User Vault Equities**: Get a user's vault equities/deposits
- **Get User Sub Accounts**: Get user's subaccounts
- **Calculate Vault Metrics**: Calculate performance metrics for a vault
- **Get Vault Portfolio Data**: Get portfolio performance data for a vault
- **Validate Vault Address**: Check if an address is a valid vault address
- **Get Vault Strategies**: Get vault strategies (child addresses) for a vault

## Installation



```bash
# with mcp-cli installed
mcp install -g @aurracloud/hyperliquid-mcp

# direct install
npx -y @aurracloud/mcp-cli install @aurracloud/hyperliquid-mcp -c cursor
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "hyperliquid": {
      "command": "npx",
      "args": ["-y", "@aurracloud/hyperliquid-mcp"],
      "env": {
        "HYPERLIQUID_TESTNET": "false"
      }
    }
  }
}
```

### Environment Variables

- `HYPERLIQUID_TESTNET`: Set to `"true"` to use Hyperliquid testnet instead of mainnet (optional, default: `false`)
- `DEBUG`: Set to `"true"` to enable debug logging (optional, default: `false`)

## Available Tools

### Trader Position Tools

#### HYPERLIQUID_getTraderPositions
Get all positions for a specific trader on Hyperliquid.

**Parameters:**
- `userAddress` (string): The trader's wallet address (0x format)

#### HYPERLIQUID_getTraderPositionForMarket
Get a trader's position for a specific market/coin on Hyperliquid.

**Parameters:**
- `userAddress` (string): The trader's wallet address (0x format)
- `coin` (string): The market/coin symbol (e.g., 'BTC', 'ETH')

#### HYPERLIQUID_getOpenOrders
Get open orders for a trader on Hyperliquid.

**Parameters:**
- `userAddress` (string): The trader's wallet address (0x format)

#### HYPERLIQUID_getUserFills
Get trading history (fills) for a user on Hyperliquid.

**Parameters:**
- `userAddress` (string): The trader's wallet address (0x format)

### Market Data Tools

#### HYPERLIQUID_getMarkets
Get all available markets/assets on Hyperliquid.

**Parameters:** None

#### HYPERLIQUID_getMarketPrice
Get current price for a specific market on Hyperliquid.

**Parameters:**
- `coin` (string): The market/coin symbol (e.g., 'BTC', 'ETH')

#### HYPERLIQUID_getMeta
Get meta information about the Hyperliquid exchange.

**Parameters:** None

#### HYPERLIQUID_getAllMids
Get all current mid prices on Hyperliquid.

**Parameters:** None

### Funding Rate Tools

#### HYPERLIQUID_getFundingRates
Get funding rates for all markets on Hyperliquid.

**Parameters:** None

#### HYPERLIQUID_getPredictedFundings
Get predicted funding rates for all markets on Hyperliquid.

**Parameters:** None

#### HYPERLIQUID_getMarketFundingRate
Get funding rate for a specific market on Hyperliquid.

**Parameters:**
- `coin` (string): The market/coin symbol (e.g., 'BTC', 'ETH')

#### HYPERLIQUID_getNextFundingTime
Get next funding time for a specific market on Hyperliquid.

**Parameters:**
- `coin` (string): The market/coin symbol (e.g., 'BTC', 'ETH')

### Vault Tools

#### HYPERLIQUID_getVaultDetails
Get detailed information about a specific vault on Hyperliquid.

**Parameters:**
- `vaultAddress` (string): The vault address (0x format)
- `userAddress` (string, optional): Optional user address to get user-specific vault data

#### HYPERLIQUID_getUserVaultEquities
Get a user's vault equities/deposits on Hyperliquid.

**Parameters:**
- `userAddress` (string): The user's wallet address (0x format)

#### HYPERLIQUID_getUserSubAccounts
Get user's subaccounts on Hyperliquid.

**Parameters:**
- `userAddress` (string): The user's wallet address (0x format)

#### HYPERLIQUID_calculateVaultMetrics
Calculate performance metrics for a vault on Hyperliquid.

**Parameters:**
- `vaultAddress` (string): The vault address (0x format)

#### HYPERLIQUID_getVaultPortfolioData
Get portfolio performance data for a vault on Hyperliquid.

**Parameters:**
- `vaultAddress` (string): The vault address (0x format)

#### HYPERLIQUID_isValidVaultAddress
Check if an address is a valid vault address on Hyperliquid.

**Parameters:**
- `address` (string): The address to validate as a vault address

#### HYPERLIQUID_getVaultStrategies
Get vault strategies (child addresses) for a vault on Hyperliquid.

**Parameters:**
- `vaultAddress` (string): The vault address (0x format)

## Development

### Building

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

## Examples

### Get BTC Market Price
```typescript
// Using the HYPERLIQUID_getMarketPrice tool
{
  "coin": "BTC"
}
```

### Get Trader Positions
```typescript
// Using the HYPERLIQUID_getTraderPositions tool
{
  "userAddress": "0x1234567890123456789012345678901234567890"
}
```

### Get Vault Details
```typescript
// Using the HYPERLIQUID_getVaultDetails tool
{
  "vaultAddress": "0xdfc24b077bc1425ad1dea75bcb6f8158e10df303"
}
```

### Get Funding Rate for ETH
```typescript
// Using the HYPERLIQUID_getMarketFundingRate tool
{
  "coin": "ETH"
}
```

## Error Handling

All tools include comprehensive error handling and will return structured error messages if:
- Invalid address formats are provided
- Network requests fail
- Invalid market symbols are used
- Vault addresses don't exist

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository. 