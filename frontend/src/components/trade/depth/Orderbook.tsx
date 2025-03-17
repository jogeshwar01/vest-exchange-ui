import { useContext, useRef } from "react";
import { TradesContext } from "../../../state/TradesProvider";

export const OrderBook = () => {
  const { bids, asks, totalBidSize, totalAskSize } = useContext(TradesContext);

  const bidsRef = useRef<HTMLDivElement | null>(null);
  const asksRef = useRef<HTMLDivElement | null>(null);

  const calculateWidth = (size: string, totalSize: number): string => {
    return totalSize ? `${(parseFloat(size) * 100) / totalSize}%` : "0%";
  };

  const calculateCumulativeWidth = (
    cumulativeSize: number,
    totalSize: number
  ): string => {
    return totalSize ? `${(cumulativeSize * 100) / totalSize}%` : "0%";
  };

  // Cumulative calculation for bids and asks
  let cumulativeBidSize = 0;
  let cumulativeAskSize = 0;

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

          <div className="flex-1 flex flex-col-reverse relative overflow-hidden">
            {/* Bids Scrollable Area */}
            <div
              ref={bidsRef}
              className="flex-1 overflow-y-auto flex flex-col"
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
                  <div key={index} className="relative w-full mb-[1px]">
                    <div className="w-full h-6 flex relative box-border text-xs leading-7 justify-between font-display ml-0">
                      <div className="flex flex-row mx-2 justify-between font-numeral w-full">
                        <div className="z-10 text-xs leading-6 text-green">
                          {order[0]}
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
                      {/* Size-based background */}
                      <div className="absolute opacity-40 w-full h-full flex justify-start">
                        <div
                          className="bg-green brightness-100 h-full"
                          style={{
                            width: calculateWidth(order[1], totalBidSize),
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
            <div className="relative w-full px-2 inline-flex justify-between items-center py-1 min-h-[26px] bg-vestgrey-800 text-white z-20">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <span className="font-[300] text-[13px] leading-[16px] text-vestgrey-100">
                    Spread
                  </span>
                </div>
              </div>
            </div>

            {/* Asks Scrollable Area */}
            <div
              ref={asksRef}
              className="flex-1 overflow-y-auto flex flex-col-reverse"
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
                  <div key={index} className="relative w-full mb-[1px]">
                    <div className="w-full h-6 flex relative box-border text-xs leading-7 justify-between font-display mr-0">
                      <div className="flex flex-row mx-2 justify-between font-numeral w-full">
                        <div className="z-10 text-xs leading-6 text-red">
                          {order[0]}
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
                      {/* Size-based background */}
                      <div className="absolute opacity-40 z-10 w-full h-full flex justify-start">
                        <div
                          className="bg-red brightness-100 h-full"
                          style={{
                            width: calculateWidth(order[1], totalAskSize),
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
