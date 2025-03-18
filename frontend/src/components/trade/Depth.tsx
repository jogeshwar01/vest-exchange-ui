import { useContext, useEffect, useState } from "react";
import { OrderBook } from "./depth/Orderbook";
import { RecentTrades } from "./depth/RecentTrades";
import { TradesContext } from "../../state/TradesProvider";
import { getTrades } from "../../services/api";
import { WsManager } from "../../utils/ws_manager";
import { Trade } from "../../utils/types";

export const Depth = ({ market }: { market: string }) => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState("orderbook"); // 'orderbook' or 'recentTrades'
  const { setTrades, setAsks, setBids, setTotalAskSize, setTotalBidSize } =
    useContext(TradesContext);

  useEffect(() => {
    WsManager.getInstance().registerCallback(
      "depth",
      (data: any) => {
        console.log("depth has been updated");
        console.log(data);

        setBids((originalBids) => {
          const bidsAfterUpdate = [...(originalBids || [])];

          for (let i = 0; i < bidsAfterUpdate.length; i++) {
            for (let j = 0; j < data.bids.length; j++) {
              if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                bidsAfterUpdate[i][1] = data.bids[j][1];
                if (Number(bidsAfterUpdate[i][1]) === 0) {
                  bidsAfterUpdate.splice(i, 1);
                }
                break;
              }
            }
          }

          for (let j = 0; j < data.bids.length; j++) {
            if (
              Number(data.bids[j][1]) !== 0 &&
              !bidsAfterUpdate.map((x) => x[0]).includes(data.bids[j][0])
            ) {
              bidsAfterUpdate.push(data.bids[j]);
              break;
            }
          }
          bidsAfterUpdate.sort((x, y) =>
            Number(y[0]) < Number(x[0]) ? -1 : 1
          );
          return bidsAfterUpdate;
        });

        setAsks((originalAsks) => {
          const asksAfterUpdate = [...(originalAsks || [])];

          for (let i = 0; i < asksAfterUpdate.length; i++) {
            for (let j = 0; j < data.asks.length; j++) {
              if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                asksAfterUpdate[i][1] = data.asks[j][1];
                if (Number(asksAfterUpdate[i][1]) === 0) {
                  asksAfterUpdate.splice(i, 1);
                }
                break;
              }
            }
          }

          for (let j = 0; j < data.asks.length; j++) {
            if (
              Number(data.asks[j][1]) !== 0 &&
              !asksAfterUpdate.map((x) => x[0]).includes(data.asks[j][0])
            ) {
              asksAfterUpdate.push(data.asks[j]);
              break;
            }
          }
          asksAfterUpdate.sort((x, y) =>
            Number(y[0]) < Number(x[0]) ? 1 : -1
          );
          return asksAfterUpdate;
        });
      },
      `DEPTH-${market}`
    );

    WsManager.getInstance().registerCallback(
      "trade",
      (data: any) => {
        console.log("trade has been updated");
        console.log(data);

        const newTrade: Trade = {
          id: data.t,
          price: data.p,
          qty: data.q,
          quoteQty: data.q,
          time: data.T,
        };

        setTrades((oldTrades) => {
          const newTrades = [...oldTrades];
          newTrades.unshift(newTrade);
          newTrades.pop();
          return newTrades;
        });
      },
      `TRADE-${market}`
    );

    WsManager.getInstance().registerCallback(
      "ticker",
      (data: any) => {
        console.log("ticker has been updated");
        console.log(data);
      },
      `TICKER-${market}`
    );

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${market}@depth`],
    });

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${market}@trades`],
    });

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`tickers`],
    });

    getTrades(market).then((trades) => {
      trades = trades.filter((trade) => parseFloat(trade.qty) !== 0);

      const bids: [string, string][] = trades
        .filter((trade) => parseFloat(trade.qty) > 0)
        .map((trade) => [trade.price, trade.qty]);

      const asks: [string, string][] = trades
        .filter((trade) => parseFloat(trade.qty) < 0)
        .map((trade) => [trade.price, (parseFloat(trade.qty) * -1).toString()]);

      bids.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
      asks.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));

      const totalBidSize = bids.reduce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (total, [_, size]) => total + parseFloat(size),
        0
      );

      const totalAskSize = asks.reduce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (total, [_, size]) => total + parseFloat(size),
        0
      );

      setBids(bids);
      setAsks(asks);
      setTotalBidSize(totalBidSize);
      setTotalAskSize(totalAskSize);

      trades = trades.slice(0, 50);
      setTrades(trades);
    });

    return () => {
      WsManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
      WsManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${market}@depth`],
      });

      WsManager.getInstance().deRegisterCallback("trade", `TRADE-${market}`);
      WsManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${market}@trades`],
      });

      WsManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
      WsManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`tickers`],
      });
    };
  }, [market, setAsks, setBids, setTotalAskSize, setTotalBidSize, setTrades]);

  return (
    <div className="flex w-full max-w-xs flex-col border-l border-border">
      <div className="flex flex-col">
        {/* Tabs Section */}
        <div className="relative">
          <div className="flex border-b border-border">
            <div
              onClick={() => setActiveTab("orderbook")}
              className={`py-2 px-3 flex items-center relative hover:cursor-pointer hover:bg-container-bg-hover justify-center leading-[16px] flex-1 ${
                activeTab === "orderbook"
                  ? "text-text-emphasis bg-container-bg-selected"
                  : "text-text-label"
              }`}
            >
              <span
                className={`flex items-center justify-center overflow-hidden whitespace-nowrap px-8 py-1 font-mono text-sm font-normal uppercase transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none" ${
                  activeTab === "orderbook" &&
                  "[text-shadow:_0_0_30px_rgb(255,90,68)] border-primary text-primary"
                }`}
              >
                DEPTH
              </span>
              {activeTab === "orderbook" && (
                <div className="absolute left-0 bottom-0 w-full z-10 h-[1px] bg-primary"></div>
              )}
            </div>

            <div
              onClick={() => setActiveTab("recentTrades")}
              className={`py-2 px-3 flex items-center relative hover:cursor-pointer hover:bg-container-bg-hover justify-center leading-[16px] flex-1 ${
                activeTab === "recentTrades"
                  ? "text-text-emphasis bg-container-bg-selected"
                  : "text-text-label"
              }`}
            >
              <span
                className={`flex items-center justify-center overflow-hidden whitespace-nowrap px-8 py-1 font-mono text-sm font-normal uppercase transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none" ${
                  activeTab === "recentTrades" &&
                  "[text-shadow:_0_0_30px_rgb(255,90,68)] border-primary text-primary"
                }`}
              >
                TRADES
              </span>
              {activeTab === "recentTrades" && (
                <div className="absolute left-0 bottom-0 w-full z-10 h-[1px] bg-primary"></div>
              )}
            </div>
          </div>
          <div
            className="w-full absolute inset-x-0 bottom-0 h-[1px] z-0"
            style={{
              background:
                "linear-gradient(to left, rgba(0,0,0,0), var(--darkBlue-50))",
            }}
          ></div>
        </div>

        {/* Custom style for WebKit-based browsers to hide scrollbar */}
        <style>{`
          div::-webkit-scrollbar {
            display: none; /* For Chrome, Safari, and Opera */
          }
        `}</style>

        {/* Tab Content */}
        {activeTab === "orderbook" ? <OrderBook /> : <RecentTrades />}
      </div>
    </div>
  );
};
