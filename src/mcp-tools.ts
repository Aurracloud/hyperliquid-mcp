import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hyperliquidService } from "./hyperliquid.js";
import HyperliquidService from "./hyperliquid.js";

/**
 * Register Hyperliquid tools with an MCP server
 * @param server The MCP server instance to register tools with
 */
export function registerHyperliquidMcpTools(server: McpServer) {
  // Define parameter schemas
  const schemas = {
    getTraderPositions: z.object({
      userAddress: z.string().describe("The trader's wallet address (0x format)."),
    }),

    getTraderPositionForMarket: z.object({
      userAddress: z.string().describe("The trader's wallet address (0x format)."),
      coin: z.string().describe("The market/coin symbol (e.g., 'BTC', 'ETH')."),
    }),

    getMarkets: z.object({}),

    getMarketPrice: z.object({
      coin: z.string().describe("The market/coin symbol (e.g., 'BTC', 'ETH')."),
    }),

    getOpenOrders: z.object({
      userAddress: z.string().describe("The trader's wallet address (0x format)."),
    }),

    getUserFills: z.object({
      userAddress: z.string().describe("The trader's wallet address (0x format)."),
    }),

    getMeta: z.object({}),

    getAllMids: z.object({}),

    getFundingRates: z.object({}),

    getPredictedFundings: z.object({}),

    getMarketFundingRate: z.object({
      coin: z.string().describe("The market/coin symbol (e.g., 'BTC', 'ETH')."),
    }),

    getNextFundingTime: z.object({
      coin: z.string().describe("The market/coin symbol (e.g., 'BTC', 'ETH')."),
    }),

    getVaultDetails: z.object({
      vaultAddress: z.string().describe("The vault address (0x format)."),
      userAddress: z.string().optional().describe("Optional user address to get user-specific vault data."),
    }),

    getUserVaultEquities: z.object({
      userAddress: z.string().describe("The user's wallet address (0x format)."),
    }),

    getUserSubAccounts: z.object({
      userAddress: z.string().describe("The user's wallet address (0x format)."),
    }),

    calculateVaultMetrics: z.object({
      vaultAddress: z.string().describe("The vault address (0x format)."),
    }),

    getVaultPortfolioData: z.object({
      vaultAddress: z.string().describe("The vault address (0x format)."),
    }),

    isValidVaultAddress: z.object({
      address: z.string().describe("The address to validate as a vault address."),
    }),

    getVaultStrategies: z.object({
      vaultAddress: z.string().describe("The vault address (0x format)."),
    }),
  };

  const mcpTools = {
    // Trader Position Tools
    getTraderPositions: server.tool(
      "getTraderPositions",
      "Get all positions for a specific trader on Hyperliquid.",
      schemas.getTraderPositions.shape,
      async ({ userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getTraderPositions(userAddress as `0x${string}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getTraderPositions: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getTraderPositionForMarket: server.tool(
      "getTraderPositionForMarket",
      "Get a trader's position for a specific market/coin on Hyperliquid.",
      schemas.getTraderPositionForMarket.shape,
      async ({ userAddress, coin }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getTraderPositionForMarket(userAddress as `0x${string}`, coin);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getTraderPositionForMarket: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getOpenOrders: server.tool(
      "getOpenOrders",
      "Get open orders for a trader on Hyperliquid.",
      schemas.getOpenOrders.shape,
      async ({ userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getOpenOrders(userAddress as `0x${string}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getOpenOrders: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getUserFills: server.tool(
      "getUserFills",
      "Get trading history (fills) for a user on Hyperliquid.",
      schemas.getUserFills.shape,
      async ({ userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getUserFills(userAddress as `0x${string}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getUserFills: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    // Market Data Tools
    getMarkets: server.tool(
      "getMarkets",
      "Get all available markets/assets on Hyperliquid.",
      schemas.getMarkets.shape,
      async () => {
        try {
          const result = await hyperliquidService.getMarkets();
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getMarkets: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getMarketPrice: server.tool(
      "getMarketPrice",
      "Get current price for a specific market on Hyperliquid.",
      schemas.getMarketPrice.shape,
      async ({ coin }) => {
        try {
          const result = await hyperliquidService.getMarketPrice(coin);
          return { content: [{ type: "text", text: JSON.stringify({ coin, price: result }, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getMarketPrice: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getMeta: server.tool(
      "getMeta",
      "Get meta information about the Hyperliquid exchange.",
      schemas.getMeta.shape,
      async () => {
        try {
          const result = await hyperliquidService.getMeta();
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getMeta: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getAllMids: server.tool(
      "getAllMids",
      "Get all current mid prices on Hyperliquid.",
      schemas.getAllMids.shape,
      async () => {
        try {
          const result = await hyperliquidService.getAllMids();
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getAllMids: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    // Funding Rate Tools
    getFundingRates: server.tool(
      "getFundingRates",
      "Get funding rates for all markets on Hyperliquid.",
      schemas.getFundingRates.shape,
      async () => {
        try {
          const result = await hyperliquidService.getFundingRates();
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getFundingRates: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getPredictedFundings: server.tool(
      "getPredictedFundings",
      "Get predicted funding rates for all markets on Hyperliquid.",
      schemas.getPredictedFundings.shape,
      async () => {
        try {
          const result = await hyperliquidService.getPredictedFundings();
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getPredictedFundings: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getMarketFundingRate: server.tool(
      "getMarketFundingRate",
      "Get funding rate for a specific market on Hyperliquid.",
      schemas.getMarketFundingRate.shape,
      async ({ coin }) => {
        try {
          const result = await hyperliquidService.getMarketFundingRate(coin);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getMarketFundingRate: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getNextFundingTime: server.tool(
      "getNextFundingTime",
      "Get next funding time for a specific market on Hyperliquid.",
      schemas.getNextFundingTime.shape,
      async ({ coin }) => {
        try {
          const result = await hyperliquidService.getNextFundingTime(coin);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getNextFundingTime: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    // Vault Tools
    getVaultDetails: server.tool(
      "getVaultDetails",
      "Get detailed information about a specific vault on Hyperliquid.",
      schemas.getVaultDetails.shape,
      async ({ vaultAddress, userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(vaultAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid vault address format. Address must be in 0x format." }], isError: true };
          }
          if (userAddress && !HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid user address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getVaultDetails(
            vaultAddress as `0x${string}`,
            userAddress ? userAddress as `0x${string}` : undefined
          );
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getVaultDetails: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getUserVaultEquities: server.tool(
      "getUserVaultEquities",
      "Get a user's vault equities/deposits on Hyperliquid.",
      schemas.getUserVaultEquities.shape,
      async ({ userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getUserVaultEquities(userAddress as `0x${string}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getUserVaultEquities: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getUserSubAccounts: server.tool(
      "getUserSubAccounts",
      "Get user's subaccounts on Hyperliquid.",
      schemas.getUserSubAccounts.shape,
      async ({ userAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(userAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid address format. Address must be in 0x format." }], isError: true };
          }
          const result = await hyperliquidService.getUserSubAccounts(userAddress as `0x${string}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getUserSubAccounts: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    calculateVaultMetrics: server.tool(
      "calculateVaultMetrics",
      "Calculate performance metrics for a vault on Hyperliquid.",
      schemas.calculateVaultMetrics.shape,
      async ({ vaultAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(vaultAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid vault address format. Address must be in 0x format." }], isError: true };
          }
          const vaultDetails = await hyperliquidService.getVaultDetails(vaultAddress as `0x${string}`);
          if (!vaultDetails) {
            return { content: [{ type: "text", text: "Error: Vault not found or invalid vault address." }], isError: true };
          }
          const result = hyperliquidService.calculateVaultMetrics(vaultDetails);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in calculateVaultMetrics: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getVaultPortfolioData: server.tool(
      "getVaultPortfolioData",
      "Get portfolio performance data for a vault on Hyperliquid.",
      schemas.getVaultPortfolioData.shape,
      async ({ vaultAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(vaultAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid vault address format. Address must be in 0x format." }], isError: true };
          }
          const vaultDetails = await hyperliquidService.getVaultDetails(vaultAddress as `0x${string}`);
          if (!vaultDetails) {
            return { content: [{ type: "text", text: "Error: Vault not found or invalid vault address." }], isError: true };
          }
          const result = hyperliquidService.getVaultPortfolioData(vaultDetails);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getVaultPortfolioData: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    isValidVaultAddress: server.tool(
      "isValidVaultAddress",
      "Check if an address is a valid vault address on Hyperliquid.",
      schemas.isValidVaultAddress.shape,
      async ({ address }) => {
        try {
          const result = await hyperliquidService.isValidVaultAddress(address);
          return { content: [{ type: "text", text: JSON.stringify({ address, isValidVault: result }, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in isValidVaultAddress: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),

    getVaultStrategies: server.tool(
      "getVaultStrategies",
      "Get vault strategies (child addresses) for a vault on Hyperliquid.",
      schemas.getVaultStrategies.shape,
      async ({ vaultAddress }) => {
        try {
          if (!HyperliquidService.isValidAddress(vaultAddress)) {
            return { content: [{ type: "text", text: "Error: Invalid vault address format. Address must be in 0x format." }], isError: true };
          }
          const vaultDetails = await hyperliquidService.getVaultDetails(vaultAddress as `0x${string}`);
          if (!vaultDetails) {
            return { content: [{ type: "text", text: "Error: Vault not found or invalid vault address." }], isError: true };
          }
          const strategies = hyperliquidService.getVaultStrategies(vaultDetails);
          const hasStrategies = hyperliquidService.hasVaultStrategies(vaultDetails);
          return { content: [{ type: "text", text: JSON.stringify({ 
            vaultAddress, 
            strategies, 
            hasStrategies,
            strategiesCount: strategies.length 
          }, null, 2) }] };
        } catch (error) {
          return { content: [{ type: "text", text: `Error in getVaultStrategies: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
      }
    ),
  };

  return mcpTools;
} 