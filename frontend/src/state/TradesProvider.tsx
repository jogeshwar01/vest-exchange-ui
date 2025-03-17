import {
  ReactNode,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Ticker } from "../utils/types";

interface TradesProviderProps {
  children: ReactNode;
}

interface TradesContextType {
  ticker: Ticker | null;
  setTicker: Dispatch<SetStateAction<Ticker | null>>;
}

const TradesContext = createContext<TradesContextType>({
  ticker: null,
  setTicker: () => {},
});

const TradesProvider = ({ children }: TradesProviderProps) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  return (
    <TradesContext.Provider
      value={{
        ticker,
        setTicker,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};

export { TradesContext, TradesProvider };
