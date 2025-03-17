export interface Ticker {
  firstPrice: string;
  high: string;
  lastPrice: string;
  low: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
}

export enum Position {
  LONG = "LONG",
  SHORT = "SHORT",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
}

export interface KLine {
  open: string; // Opening price (string)
  high: string; // High price (string)
  low: string; // Low price (string)
  close: string; // Close price (string)
  start: number; // Open time (timestamp as number)
  volume: string; // Volume (string)
  end: number; // Close time (timestamp as number)
  quoteVolume: string; // Quote volume (string)
  trades: number; // Number of trades (number)
}
