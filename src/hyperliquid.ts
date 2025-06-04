import * as hl from "@nktkas/hyperliquid";

// Use the actual types returned by the API
export type TraderPosition = any; // Will be typed by the actual API response
export type UserState = any; // Will be typed by the actual API response

export interface MarketInfo {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  onlyIsolated: boolean;
}

export interface VaultDetails {
  name: string;
  vaultAddress: string;
  leader: string;
  description: string;
  portfolio: any[];
  apr: number;
  followerState: any;
  leaderFraction: number;
  leaderCommission: number;
  followers: VaultFollower[];
  maxDistributable: number;
  maxWithdrawable: number;
  isClosed: boolean;
  relationship: {
    type: string;
    data?: {
      childAddresses?: string[];
    };
  } | null;
  allowDeposits: boolean;
  alwaysCloseOnWithdraw: boolean;
}

export interface VaultFollower {
  user: string;
  vaultEquity: string;
  pnl: string;
  allTimePnl: string;
  daysFollowing: number;
  vaultEntryTime: number;
  lockupUntil: number;
}

export interface UserVaultEquity {
  vaultAddress: string;
  equity: string;
}

class HyperliquidService {
  private infoClient: hl.InfoClient;
  private transport: hl.HttpTransport;

  constructor(isTestnet: boolean = false) {
    this.transport = new hl.HttpTransport({
      isTestnet,
      timeout: 10000,
    });
    this.infoClient = new hl.InfoClient({ transport: this.transport });
  }

  /**
   * Get all positions for a specific trader
   */
  async getTraderPositions(userAddress: `0x${string}`) {
    try {
      const userState = await this.infoClient.clearinghouseState({ user: userAddress });
      return userState;
    } catch (error) {
      console.error("Error fetching trader positions:", error);
      return null;
    }
  }

  /**
   * Get position for a specific market/coin
   */
  async getTraderPositionForMarket(
    userAddress: `0x${string}`,
    coin: string
  ) {
    try {
      const userState = await this.getTraderPositions(userAddress);
      if (!userState) return null;

      // Handle the actual structure of assetPositions
      const position = userState.assetPositions?.find(
        (pos: any) => {
          // Check if position has a nested structure or direct coin property
          const coinName = pos.position?.coin || pos.coin;
          return coinName?.toLowerCase() === coin.toLowerCase();
        }
      );
      return position || null;
    } catch (error) {
      console.error("Error fetching position for market:", error);
      return null;
    }
  }

  /**
   * Get all available markets/assets
   */
  async getMarkets(): Promise<MarketInfo[]> {
    try {
      const meta = await this.infoClient.meta();
      return meta.universe.map((asset: any) => ({
        name: asset.name,
        szDecimals: asset.szDecimals,
        maxLeverage: asset.maxLeverage,
        onlyIsolated: asset.onlyIsolated ?? false,
      }));
    } catch (error) {
      console.error("Error fetching markets:", error);
      return [];
    }
  }

  /**
   * Get current price for a specific market
   */
  async getMarketPrice(coin: string): Promise<string | null> {
    try {
      const allMids = await this.infoClient.allMids();
      const marketIndex = await this.getMarketIndex(coin);
      if (marketIndex === -1) return null;

      // Handle the actual structure of allMids response
      const midsArray = Array.isArray(allMids) ? allMids : Object.values(allMids);
      return midsArray[marketIndex] || null;
    } catch (error) {
      console.error("Error fetching market price:", error);
      return null;
    }
  }

  /**
   * Get market index for a coin (needed for price lookups)
   */
  private async getMarketIndex(coin: string): Promise<number> {
    try {
      const meta = await this.infoClient.meta();
      const assetIndex = meta.universe.findIndex(
        (asset: any) => asset.name.toLowerCase() === coin.toLowerCase()
      );
      return assetIndex;
    } catch (error) {
      console.error("Error getting market index:", error);
      return -1;
    }
  }

  /**
   * Get open orders for a trader
   */
  async getOpenOrders(userAddress: `0x${string}`) {
    try {
      const openOrders = await this.infoClient.openOrders({ user: userAddress });
      return openOrders;
    } catch (error) {
      console.error("Error fetching open orders:", error);
      return [];
    }
  }

  /**
   * Get user's trading history
   */
  async getUserFills(userAddress: `0x${string}`) {
    try {
      const userFills = await this.infoClient.userFills({ user: userAddress });
      return userFills;
    } catch (error) {
      console.error("Error fetching user fills:", error);
      return [];
    }
  }

  /**
   * Get meta information about the exchange
   */
  async getMeta() {
    try {
      const meta = await this.infoClient.meta();
      return meta;
    } catch (error) {
      console.error("Error fetching meta:", error);
      return null;
    }
  }

  /**
   * Get all current mid prices
   */
  async getAllMids() {
    try {
      const allMids = await this.infoClient.allMids();
      return allMids;
    } catch (error) {
      console.error("Error fetching all mids:", error);
      return [];
    }
  }

  /**
   * Get funding rates for all markets
   */
  async getFundingRates() {
    try {
      const metaAndAssetCtxs = await this.infoClient.metaAndAssetCtxs();
      return metaAndAssetCtxs;
    } catch (error) {
      console.error("Error fetching funding rates:", error);
      return null;
    }
  }

  /**
   * Get predicted funding rates for all markets
   */
  async getPredictedFundings() {
    try {
      const predictedFundings = await this.infoClient.predictedFundings();
      return predictedFundings;
    } catch (error) {
      console.error("Error fetching predicted fundings:", error);
      return null;
    }
  }

  /**
   * Get funding rate for a specific market
   */
  async getMarketFundingRate(coin: string) {
    try {
      const metaAndAssetCtxs = await this.getFundingRates();
      if (!metaAndAssetCtxs) return null;

      const [meta, assetCtxs] = metaAndAssetCtxs;
      const marketIndex = meta.universe.findIndex(
        (asset: any) => asset.name.toLowerCase() === coin.toLowerCase()
      );

      if (marketIndex === -1 || !assetCtxs[marketIndex]) return null;

      return {
        coin: coin.toUpperCase(),
        currentFunding: assetCtxs[marketIndex].funding,
        premium: assetCtxs[marketIndex].premium,
        markPrice: assetCtxs[marketIndex].markPx,
        oraclePrice: assetCtxs[marketIndex].oraclePx,
      };
    } catch (error) {
      console.error("Error fetching market funding rate:", error);
      return null;
    }
  }

  /**
   * Get next funding time for a specific market
   */
  async getNextFundingTime(coin: string) {
    try {
      const predictedFundings = await this.getPredictedFundings();
      if (!predictedFundings) return null;

      // Find the market in predicted fundings
      const marketData = predictedFundings.find(([marketCoin]: [string, any]) => 
        marketCoin.toLowerCase() === coin.toLowerCase()
      );

      if (!marketData) return null;

      const [, venues] = marketData;
      // Look for Hyperliquid venue (HlPerp)
      const hlVenue = venues.find(([venueName]: [string, any]) => venueName === "HlPerp");
      
      if (hlVenue) {
        const [, venueData] = hlVenue;
        if (venueData) {
          return {
            nextFundingTime: venueData.nextFundingTime,
            fundingRate: venueData.fundingRate,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching next funding time:", error);
      return null;
    }
  }

  /**
   * Helper function to validate and format Ethereum addresses
   */
  static isValidAddress(address: string): address is `0x${string}` {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Helper function to format address for API calls
   */
  static formatAddress(address: string): `0x${string}` | null {
    if (this.isValidAddress(address)) {
      return address;
    }
    return null;
  }

  /**
   * Get detailed information about a specific vault
   */
  async getVaultDetails(vaultAddress: `0x${string}`, userAddress?: `0x${string}`): Promise<VaultDetails | null> {
    try {
      const requestBody: any = {
        type: "vaultDetails",
        vaultAddress: vaultAddress,
      };

      if (userAddress) {
        requestBody.user = userAddress;
      }

      const response = await fetch(`${this.transport.isTestnet ? 'https://api.hyperliquid-testnet.xyz' : 'https://api.hyperliquid.xyz'}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const vaultDetails = await response.json() as VaultDetails;
      return vaultDetails;
    } catch (error) {
      console.error("Error fetching vault details:", error);
      return null;
    }
  }

  /**
   * Get a user's vault equities/deposits
   */
  async getUserVaultEquities(userAddress: `0x${string}`): Promise<UserVaultEquity[]> {
    try {
      const response = await fetch(`${this.transport.isTestnet ? 'https://api.hyperliquid-testnet.xyz' : 'https://api.hyperliquid.xyz'}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "userVaultEquities",
          user: userAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const vaultEquities = await response.json() as UserVaultEquity[];
      return vaultEquities || [];
    } catch (error) {
      console.error("Error fetching user vault equities:", error);
      return [];
    }
  }

  /**
   * Get user's subaccounts (which may include vault information)
   */
  async getUserSubAccounts(userAddress: `0x${string}`) {
    try {
      const response = await fetch(`${this.transport.isTestnet ? 'https://api.hyperliquid-testnet.xyz' : 'https://api.hyperliquid.xyz'}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "subAccounts",
          user: userAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const subAccounts = await response.json();
      return subAccounts || [];
    } catch (error) {
      console.error("Error fetching user sub accounts:", error);
      return [];
    }
  }

  /**
   * Calculate vault performance metrics
   */
  calculateVaultMetrics(vaultDetails: VaultDetails) {
    if (!vaultDetails.portfolio || vaultDetails.portfolio.length === 0) {
      return null;
    }

    const metrics = {
      totalFollowers: vaultDetails.followers.length,
      totalEquity: vaultDetails.followers.reduce((sum, follower) => sum + parseFloat(follower.vaultEquity), 0),
      averageDaysFollowing: vaultDetails.followers.length > 0 
        ? vaultDetails.followers.reduce((sum, follower) => sum + follower.daysFollowing, 0) / vaultDetails.followers.length 
        : 0,
      totalPnl: vaultDetails.followers.reduce((sum, follower) => sum + parseFloat(follower.pnl), 0),
      totalAllTimePnl: vaultDetails.followers.reduce((sum, follower) => sum + parseFloat(follower.allTimePnl), 0),
      apr: vaultDetails.apr,
      leaderCommission: vaultDetails.leaderCommission,
      isAcceptingDeposits: vaultDetails.allowDeposits,
      isClosed: vaultDetails.isClosed,
    };

    return metrics;
  }

  /**
   * Get vault portfolio performance data
   */
  getVaultPortfolioData(vaultDetails: VaultDetails) {
    if (!vaultDetails.portfolio || vaultDetails.portfolio.length === 0) {
      return null;
    }

    const portfolioData: any = {};
    
    vaultDetails.portfolio.forEach(([period, data]) => {
      portfolioData[period] = {
        accountValueHistory: data.accountValueHistory || [],
        pnlHistory: data.pnlHistory || [],
        volume: data.vlm || "0.0",
      };
    });

    return portfolioData;
  }

  /**
   * Check if an address is a valid vault address
   */
  async isValidVaultAddress(address: string): Promise<boolean> {
    if (!HyperliquidService.isValidAddress(address)) {
      return false;
    }

    try {
      const vaultDetails = await this.getVaultDetails(address as `0x${string}`);
      return vaultDetails !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get vault strategies (child addresses) from vault details
   */
  getVaultStrategies(vaultDetails: VaultDetails): string[] {
    if (vaultDetails.relationship?.type === "parent" && vaultDetails.relationship.data?.childAddresses) {
      return vaultDetails.relationship.data.childAddresses;
    }
    return [];
  }

  /**
   * Check if a vault has strategies (child addresses)
   */
  hasVaultStrategies(vaultDetails: VaultDetails): boolean {
    return this.getVaultStrategies(vaultDetails).length > 0;
  }
}

// Export a singleton instance for the app
export const hyperliquidService = new HyperliquidService(process.env.HYPERLIQUID_TESTNET === 'true');
export const hyperliquidTestnetService = new HyperliquidService(true);

export default HyperliquidService; 