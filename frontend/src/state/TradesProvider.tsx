import {
  ReactNode,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Ticker, Trade } from "../utils/types";

interface TradesProviderProps {
  children: ReactNode;
}

interface TradesContextType {
  ticker: Ticker | null;
  setTicker: Dispatch<SetStateAction<Ticker | null>>;
  trades: Trade[];
  setTrades: Dispatch<SetStateAction<Trade[]>>;
  bids: [string, string][];
  asks: [string, string][];
  setBids: Dispatch<SetStateAction<[string, string][]>>;
  setAsks: Dispatch<SetStateAction<[string, string][]>>;
  totalBidSize: number;
  setTotalBidSize: Dispatch<SetStateAction<number>>;
  totalAskSize: number;
  setTotalAskSize: Dispatch<SetStateAction<number>>;
}

const TradesContext = createContext<TradesContextType>({
  ticker: null,
  setTicker: () => {},
  trades: [],
  setTrades: () => {},
  bids: [],
  setBids: () => {},
  asks: [],
  setAsks: () => {},
  totalBidSize: 0,
  setTotalBidSize: () => {},
  totalAskSize: 0,
  setTotalAskSize: () => {},
});

const TradesProvider = ({ children }: TradesProviderProps) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const [bids, setBids] = useState<[string, string][]>([]); // [price, quantity]
  const [asks, setAsks] = useState<[string, string][]>([]); // [price, quantity]
  const [totalBidSize, setTotalBidSize] = useState<number>(0);
  const [totalAskSize, setTotalAskSize] = useState<number>(0);

  return (
    <TradesContext.Provider
      value={{
        ticker,
        setTicker,
        trades,
        setTrades,
        bids,
        setBids,
        asks,
        setAsks,
        totalBidSize,
        setTotalBidSize,
        totalAskSize,
        setTotalAskSize,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};

export { TradesContext, TradesProvider };
