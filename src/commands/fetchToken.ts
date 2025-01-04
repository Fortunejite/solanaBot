import { Context } from "telegraf";

const axios = require("axios");
interface Data {
  name: string;
  symbol: string;
  market_data: {
    current_price: {
      usd: number;
    },
    market_cap: {
      usd: number;
    },
    price_change_percentage_24h: string
  }
  price: string;
  marketCap: string;
  priceChange24h: string;
}

export const messageAction = async (ctx: Context) => {
  if (ctx.message && 'text' in ctx.message) {
    const res = JSON.stringify(await fetchTokenData(ctx.message.text))
    ctx.reply(res)
  } else {
    ctx.reply('Unsupported message type');
  }
}


async function fetchTokenData(input: string) {
  const baseUrl = "https://api.coingecko.com/api/v3";

  try {
    // Check if input is a URL
    if (input.startsWith("http")) {
      const contractAddress = input.split("/").pop();
      return await getTokenDataByContract(baseUrl, contractAddress);
    }

    // Check if input is a contract address (Base58, length ~44)
    if (/^[A-HJ-NP-Za-km-z1-9]{44}$/.test(input)) {
      return await getTokenDataByContract(baseUrl, input);
    }

    // Otherwise, assume input is a token name
    return await getTokenDataByName(baseUrl, input);
  } catch (error) {
    console.error("Error fetching token data:", error);
    return { error: "Failed to fetch token data. Please check the input." };
  }
}

async function getTokenDataByContract(baseUrl: string, contractAddress: string | undefined) {
  const url = `${baseUrl}/coins/solana/contract/${contractAddress}`;
  const response = await axios.get(url);
  return formatTokenData(response.data);
}

async function getTokenDataByName(baseUrl: string, tokenName: string | undefined) {
  // Search for the token
  const searchUrl = `${baseUrl}/search?query=${tokenName}`;
  const searchResponse = await axios.get(searchUrl);
  const token = searchResponse.data.coins[0]; // Assume the first result is the desired token

  if (!token) throw new Error("Token not found.");

  // Fetch token details by ID
  const detailsUrl = `${baseUrl}/coins/${token.id}`;
  const detailsResponse = await axios.get(detailsUrl);
  return formatTokenData(detailsResponse.data);
}

function formatTokenData(data: Data) {
  console.log(data);
  
  return {
    name: data.name,
    symbol: data.symbol,
    price: data.market_data.current_price.usd,
    marketCap: data.market_data.market_cap.usd,
    priceChange24h: data.market_data.price_change_percentage_24h,
  };
}