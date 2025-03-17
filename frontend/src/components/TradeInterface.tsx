import { OrdersMenu } from "./trade/OrdersMenu";
import { TradeView } from "./trade/TradeView";

function TradeInterface({ market }: { market: string }) {
  return (
    <div className="flex flex-col gap-2">
      <TradeView market={market as string} />

      <OrdersMenu />
    </div>
  );
}

export default TradeInterface;
