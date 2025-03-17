import LeverageButton from "./market/LeverageButton";
import MarketButton from "./market/MarketButton";
import MarketStats from "./market/MarketStats";

function MarketBar({ market }: { market: string }) {
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
