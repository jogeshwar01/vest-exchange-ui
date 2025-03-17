function ConnectWalletButton() {
  return (
    <div className="relative flex gap-4 border-l border-border pr-8 font-mono text-sm w-[80%] max-w-xs">
      <div className="grid w-full">
        <div className="flex w-full items-center justify-between">
          <button className="inline-flex text-md align-middle items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-background shadow hover:bg-primary/90 px-4 py-2 ml-6 h-11 w-full rounded-none font-mono font-normal uppercase tracking-wider">
            CONNECT YOUR WALLET
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletButton;
