import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChartManager } from "../../utils/chart_manager";
import { getKlines } from "../../services/api";
import { KLine } from "../../utils/types";
import { TradesContext } from "../../state/TradesProvider";
import { WsManager } from "../../utils/ws_manager";

const timeOptions = [
  { label: "1m", value: "1m" },
  { label: "1H", value: "1h" },
  { label: "1D", value: "1d" },
];

export const TradeView = ({ market }: { market: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);
  const [selectedTime, setSelectedTime] = useState("1m"); // Default to 1 minute

  const { ticker } = useContext(TradesContext);

  const fetchKlineData = useCallback(
    async (interval: string) => {
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(
          market,
          interval,
          Math.floor(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) // Last week
        );
      } catch (e) {
        console.error("Error fetching Kline data:", e);
      }

      if (chartRef.current && klineData.length > 0) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy(); // Destroy existing chart instance
        }

        const cleanedKlineData = klineData
          .map((x) => ({
            close: parseFloat(x.close),
            high: parseFloat(x.high),
            low: parseFloat(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end),
          }))
          .sort((x, y) => (x.timestamp > y.timestamp ? 1 : -1));

        // Initialize a new ChartManager
        const chartManager = new ChartManager(
          chartRef.current,
          cleanedKlineData,
          {
            background: "rgb(15 15 15)",
            color: "white",
          }
        );

        chartManagerRef.current = chartManager; // Assign the new chart manager instance
      }
    },
    [market]
  );

  useEffect(() => {
    // Fetch initial Kline data only on first load
    fetchKlineData(selectedTime);

    WsManager.getInstance().registerCallback(
      `kline_${selectedTime}`,
      (data: any) => {
        const kline: KLine = {
          start: data[0],
          open: data[1],
          high: data[2],
          low: data[3],
          close: data[4],
          volume: data[5],
          end: data[6],
          quoteVolume: data[7],
          trades: data[8],
        };

        const cleanedKline = {
          close: parseFloat(kline.close),
          high: parseFloat(kline.high),
          low: parseFloat(kline.low),
          open: parseFloat(kline.open),
          timestamp: new Date(kline.end),
        };

        if (chartManagerRef.current) {
          chartManagerRef.current.update(cleanedKline);
        }
      },
      `${market}@kline_${selectedTime}`
    );

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${market}@kline_${selectedTime}`],
    });

    // Cleanup the chart and WebSocket callback on unmount or when time interval changes
    return () => {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
        chartManagerRef.current = null; // Ensure the reference is cleared after destruction
      }

      WsManager.getInstance().deRegisterCallback(
        `kline_${selectedTime}`,
        `${market}@kline_${selectedTime}`
      );
      WsManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${market}@kline_${selectedTime}`],
      });
    };
  }, [fetchKlineData, market, selectedTime]);

  return (
    <div className="h-full min-h-[450px] max-h-[525px] bg-container-bg overflow-hidden w-full ml-2 flex flex-col">
      <div className="w-full py-2 px-3 flex items-center relative justify-between leading-[16px] flex-1 text-text-emphasis">
        <div className="w-[20%] text-lg font-semibold">
          {ticker?.symbol ? `${ticker?.symbol?.split("-")?.[0]} / USDC` : ""}
        </div>
        <div className="flex space-x-2">
          <div className="w-[20%] py-1 text-xs">Time</div>

          {timeOptions.map((option) => (
            <button
              key={option.label}
              className={`px-2 text-xs ${
                selectedTime === option.value
                  ? "text-white font-bold"
                  : "text-text-emphasis"
              }`}
              onClick={() => setSelectedTime(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="w-[15%] text-right my-1">
          <div className="font-semibold text-xs">Trading View</div>
        </div>
      </div>

      <div className="h-full">
        <div ref={chartRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};
