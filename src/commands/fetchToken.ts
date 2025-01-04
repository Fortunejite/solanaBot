import { Context } from 'telegraf';
import { formatNumber } from '../utils/formating';

const axios = require('axios');
interface Data {
  name: string;
  symbol: string;
  platforms: {
    solana: string;
  };
  categories: string[];
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
  };
  price: string;
  marketCap: string;
  priceChange24h: string;
}

export const messageAction = async (ctx: Context) => {
  if (ctx.message && 'text' in ctx.message) {
    const notFoundMessage = `Token not found. Make sure address (${ctx.message.text}) is correct. You can enter a ticker, token address, or a pump.fun, Solscan, Birdeye, DEX Screener or Meteora URL. If you are trying to enter a buy or sell amount, ensure you click and reply to the message.`;
    const res = await fetchTokenData(ctx.message.text);
    if (!res) return ctx.reply(notFoundMessage);
    if (res.stablecoin)
      return ctx.reply('Stable coin swaps are not supported in BONKbot!');
    const contractAddress = res.address;
    const foundMessage = `${res.symbol} | ${
      res.name
    } | <code>${contractAddress}</code>
<a href='https://solscan.io/account/${contractAddress}'>Explorer</a> | <a href='https://dexscreener.com/solana/${contractAddress}?id=q96ayw75'>Chart</a> | <a href='https://t.me/RickBurpBot?start=${contractAddress}'>Scan</a>

Price: $${formatNumber(res.price)}
5m: +0.12%, 1h: +0.03%, 6h: -0.04%, 24h: ${res.priceChange24h.toFixed(2)}%
Market Cap: $${formatNumber(res.marketCap)}

Price Impact (5.0000 SOL): ⚠️ 19.28%

Wallet Balance: 0.0000 SOL

<a href='https://t.me/bonkbot_bot?start=st_${contractAddress}'>Share with Reflink</a>
To buy press one of the buttons below.`;
    ctx.telegram.sendMessage(ctx.chat?.id!, foundMessage, {
      parse_mode: 'HTML',
      link_preview_options: {
        is_disabled: false,
      },
    });
  } else {
    ctx.reply('Unsupported message type');
  }
};

async function fetchTokenData(input: string) {
  const baseUrl = 'https://api.coingecko.com/api/v3';

  try {
    // Check if input is a URL
    if (input.startsWith('http')) {
      const contractAddress = input.split('/').pop();
      return await getTokenDataByContract(baseUrl, contractAddress);
    }

    // Check if input is a contract address (Base58, length ~44)
    if (/^[A-HJ-NP-Za-km-z1-9]{44}$/.test(input)) {
      return await getTokenDataByContract(baseUrl, input);
    }

    // Otherwise, assume input is a token name
    return await getTokenDataByName(baseUrl, input);
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

async function getTokenDataByContract(
  baseUrl: string,
  contractAddress: string | undefined,
) {
  const url = `${baseUrl}/coins/solana/contract/${contractAddress}`;
  const response = await axios.get(url);
  return formatTokenData(response.data);
}

async function getTokenDataByName(
  baseUrl: string,
  tokenName: string | undefined,
) {
  // Search for the token
  const searchUrl = `${baseUrl}/search?query=${tokenName}`;
  const searchResponse = await axios.get(searchUrl);
  const token = searchResponse.data.coins[0]; // Assume the first result is the desired token

  if (!token) return null;

  // Fetch token details by ID
  const detailsUrl = `${baseUrl}/coins/${token.id}`;
  const detailsResponse = await axios.get(detailsUrl);
  return formatTokenData(detailsResponse.data);
}

function formatTokenData(data: Data) {
  if (!data) return null;
  const isStablecoin =
    (data.categories && data.categories.includes('stablecoin')) ||
    checkPriceStability(data.market_data);

  return {
    name: data.name,
    symbol: data.symbol,
    price: data.market_data.current_price.usd,
    marketCap: data.market_data.market_cap.usd,
    priceChange24h: data.market_data.price_change_percentage_24h,
    stablecoin: isStablecoin,
    address: data.platforms.solana,
  };
}

function checkPriceStability(marketData: Data['market_data']) {
  const price = marketData.current_price.usd;

  // Define thresholds for price stability
  const stabilityThreshold = 0.02; // e.g., 2% deviation from $1
  const stableValue = 1.0;

  const priceFluctuation =
    Math.abs(price - stableValue) / stableValue <= stabilityThreshold;

  return (
    priceFluctuation &&
    Math.abs(marketData.price_change_percentage_24h || 0) < 0.5 &&
    Math.abs(marketData.price_change_percentage_7d || 0) < 1
  );
}
