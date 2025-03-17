function MarketButton({ market }: { market: string }) {
  return (
    <div>
      <div className="flex h-full gap-4 border-r border-border pl-8">
        <div className="self-center">
          <div className="cursor-pointer"></div>
        </div>

        <div className="grid grow">
          <button className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-3">
            <img src="/tokens/star.svg" alt="Vest" className="h-4 color-white" />
            <img src="/tokens/eth.png" alt="ETH" className="w-4 h-4" />
              <span className="text-font text-lg font-bold">{market}</span>
              <div className="rounded bg-[#271714] px-2 py-0.5">
                <span className="font-mono text-primary text-md align-middle">50X</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketButton;
