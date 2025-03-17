import { useContext, useEffect, useState } from "react";
import { OrderBook } from "./depth/Orderbook";
import { RecentTrades } from "./depth/RecentTrades";
import { TradesContext } from "../../state/TradesProvider";
import { getTrades } from "../../services/api";

export const Depth = ({ market }: { market: string }) => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState("orderbook"); // 'orderbook' or 'recentTrades'
  const { setTrades, setAsks, setBids, setTotalAskSize, setTotalBidSize } =
    useContext(TradesContext);

  useEffect(() => {
    getTrades(market).then((trades) => {
      trades = trades.filter((trade) => parseFloat(trade.qty) !== 0);
      trades = trades.slice(0, 50);
      setTrades(trades);

      const bids: [string, string][] = trades
        .filter((trade) => parseFloat(trade.qty) > 0)
        .map((trade) => [trade.price, trade.qty]);

      const asks: [string, string][] = trades
        .filter((trade) => parseFloat(trade.qty) < 0)
        .map((trade) => [trade.price, (parseFloat(trade.qty) * -1).toString()]);

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
    });
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
