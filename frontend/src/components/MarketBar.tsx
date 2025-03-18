import { useContext, useEffect } from "react";
import { getTickers } from "../services/api";
import { TradesContext } from "../state/TradesProvider";
import LeverageButton from "./market/LeverageButton";
import MarketButton from "./market/MarketButton";
import MarketStats from "./market/MarketStats";
import { WsManager } from "../utils/ws_manager";

function MarketBar({ market }: { market: string }) {
  const { setTicker } = useContext(TradesContext);

  useEffect(() => {
    getTickers().then((tickers) => {
      const marketTicker = tickers.find((ticker) => ticker.symbol === market);
      setTicker(marketTicker);
    });

    WsManager.getInstance().registerCallback(
      "tickers",
      (data: any) => {
        const marketTicker = data.find(
          (ticker: any) => ticker.symbol === market
        );
        setTicker(marketTicker);
      },
      `tickers`
    );

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`tickers`],
    });

    return () => {
      WsManager.getInstance().deRegisterCallback("tickers", `tickers`);
      WsManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`tickers`],
      });
    };
  }, [market, setTicker]);

  return (
    <>
      <div className="col-span-4 grid grid-cols-[320px_1fr]">
        <MarketButton market={market} />
        <MarketStats />
      </div>
      <LeverageButton />
    </>
  );
}

export default MarketBar;
