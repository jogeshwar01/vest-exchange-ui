import { TradeView } from "./trade/TradeView";

function TradeInterface({ market }: { market: string }) {
  return <TradeView market={market as string} />;
}

export default TradeInterface;
