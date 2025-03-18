import { Navigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import PromoteBar from "../components/PromoteBar";
import MarketBar from "../components/MarketBar";
import SwapInterface from "../components/SwapInterface";
import TradeInterface from "../components/TradeInterface";
import { markets } from "../utils/constants";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { TradesContext } from "../state/TradesProvider";

export const Trade = () => {
  const { market } = useParams();
  const { ticker } = useContext(TradesContext);

  if (!markets.includes(market as string)) {
    return <Navigate to="/trade/ETH-PERP" />;
  }

  return (
    <div className="flex h-full flex-col">
      <Helmet>
        <title>{`${
          ticker?.symbol && ticker?.markPrice
            ? ticker?.markPrice + " | " + ticker?.symbol + " | "
            : ""
        } Vest`}</title>
        <meta name="description" content="Markets Without Manipulation" />
        <link rel="icon" href="/favicon.svg" type="image/x-icon" />
      </Helmet>

      <div className="flex items-center justify-between border-b border-border px-8 py-2.5">
        <PromoteBar />
      </div>

      <header className="hidden h-15 shrink-0 grid-cols-5 border-b border-border bg-background md:flex">
        <NavBar />
      </header>

      <main className="h-full">
        <div className="hidden h-full md:block">
          <div className="flex h-full flex-col">
            <div className="grid h-[56px] shrink-0 grid-cols-5 border-b border-border bg-background">
              <MarketBar market={market as string} />
            </div>
            <div className="flex flex-1">
              <div className="flex flex-1 flex-col">
                <TradeInterface market={market as string} />
              </div>
              <div className="flex w-full max-w-sm flex-col border-l border-border bg-background lg:max-w-xs">
                <SwapInterface market={market as string} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
