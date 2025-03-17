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
  open: string;
  high: string;
  low: string;
  close: string;
  start: number;
  volume: string;
  end: number;
  quoteVolume: string;
  trades: number;
}

export interface Trade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
}

export interface Depth {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: string;
}

export interface Ticker {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  imbalance: string;
  oneHrFundingRate: string;
  cumFunding: string;
  status: string;
}
