import { useContext } from "react";
import { TradesContext } from "../../state/TradesProvider";

function MarketButton() {
  const { ticker } = useContext(TradesContext);

  return (
    <div>
      <div className="flex h-full gap-4 border-r border-border pl-8">
        <div className="self-center">
          <div className="cursor-pointer"></div>
        </div>

        <div className="grid grow">
          <button className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
              <img
                src="/tokens/star.svg"
                alt="Vest"
                className="h-4 color-white"
              />
              <img
                src={`/tokens/${ticker?.symbol
                  ?.split("-")?.[0]
                  ?.toLowerCase()}.png`}
                alt="token"
                className="w-4 h-4"
              />
              <span className="text-font text-lg font-bold">
                {ticker?.symbol?.split("-")?.[0]} / USDC
              </span>
              <div className="rounded bg-[#271714] px-2 py-0.5">
                <div className="font-mono text-primary text-md align-middle">
                  50X
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketButton;
