import { useContext, useRef } from "react";
import { TradesContext } from "../../../state/TradesProvider";

export const OrderBook = () => {
  const { bids, asks, totalBidSize, totalAskSize } = useContext(TradesContext);

  const bidsRef = useRef<HTMLDivElement | null>(null);
  const asksRef = useRef<HTMLDivElement | null>(null);

  const calculateCumulativeWidth = (
    cumulativeSize: number,
    totalSize: number
  ): string => {
    return totalSize ? `${(cumulativeSize * 100) / totalSize}%` : "0%";
  };

  // Cumulative calculation for bids and asks
  let cumulativeBidSize = 0;
  let cumulativeAskSize = 0;

  // Get the highest bid and lowest ask
  const highestBid = bids && bids[0] ? parseFloat(bids[0][0]) : 0;
  const lowestAsk = asks && asks[0] ? parseFloat(asks[0][0]) : 0;

  // Calculate spread
  const spread = highestBid && lowestAsk ? lowestAsk - highestBid : 0;
  const spreadPercentage =
    spread && highestBid ? (spread / highestBid) * 100 : 0;

  return (
    <div className="h-full">
      {/* Order Book */}
      <div className="relative h-full bg-background">
        <div className="flex flex-col h-full text-white fadein-floating-element bg-background xs:min-h-[25vh] md:min-h-0">
          <div className="flex justify-between text-xs px-2 py-1 text-vestgrey-100">
            <span className="font-[300] text-[12px] leading-[14px] tracking-[0.15px] text-center">
              Price
            </span>
            <span className="font-[300] text-[12px] leading-[14px] tracking-[0.15px] text-left">
              Size
            </span>
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Bids Scrollable Area */}
            <div
              ref={bidsRef}
              className="flex-1 overflow-y-auto flex flex-col-reverse"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {bids?.map((order, index) => {
                const size = parseFloat(order[1]);
                cumulativeBidSize += size; // Keep track of cumulative size

                return (
                  <div key={index} className="relative w-full my-[2px]">
                    <div className="w-full h-6 flex relative box-border text-xs leading-7 justify-between font-display ml-0">
                      <div className="flex flex-row mx-2 justify-between font-numeral w-full">
                        <div className="z-10 text-xs leading-6 text-green">
                          {parseFloat(order[0]).toFixed(3)}
                        </div>
                        <div className="z-10 text-xs leading-6 text-vestgrey-100">
                          {order[1]}
                        </div>
                      </div>
                      {/* Cumulative background */}
                      <div className="absolute opacity-20 w-full h-full flex justify-start">
                        <div
                          className="bg-green brightness-80 h-full"
                          style={{
                            width: calculateCumulativeWidth(
                              cumulativeBidSize,
                              totalBidSize
                            ),
                            transition: "width 0.3s ease-in-out",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Orderbook Spread */}
            <div className="relative w-full px-2 inline-flex justify-center gap-4 items-center py-1 min-h-[26px] bg-vestgrey-800 text-white z-20">
              <div className="font-[300] text-[13px] leading-[16px] text-vestgrey-100">
                Spread
              </div>
              <div className="text-xs text-vestgrey-300">
                {spread > 0 ? `${spread.toFixed(4)}` : "No spread"}
              </div>
              <div className="text-xs text-vestgrey-300">
                {spread > 0 && `${spreadPercentage.toFixed(1)}%`}
              </div>
            </div>

            {/* Asks Scrollable Area */}
            <div
              ref={asksRef}
              className="flex-1 overflow-y-auto flex flex-col"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {asks?.map((order, index) => {
                const size = parseFloat(order[1]);
                cumulativeAskSize += size; // Keep track of cumulative size

                return (
                  <div key={index} className="relative w-full my-[2px]">
                    <div className="w-full h-6 flex relative box-border text-xs leading-7 justify-between font-display mr-0">
                      <div className="flex flex-row mx-2 justify-between font-numeral w-full">
                        <div className="z-10 text-xs leading-6 text-red">
                          {parseFloat(order[0]).toFixed(3)}
                        </div>
                        <div className="z-10 text-xs leading-6 text-vestgrey-100">
                          {order[1]}
                        </div>
                      </div>
                      {/* Cumulative background */}
                      <div className="absolute opacity-20 w-full h-full flex justify-start">
                        <div
                          className="bg-red brightness-80 h-full"
                          style={{
                            width: calculateCumulativeWidth(
                              cumulativeAskSize,
                              totalAskSize
                            ),
                            transition: "width 0.3s ease-in-out",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
