function MarketStats() {
  const stats = [
    { label: "MARK PRICE", value: "1,906.445" },
    { label: "INDEX PRICE", value: "1,906.416" },
    { label: "24H CHANGE", value: "+19.550 / 1.03%", className: "text-green" },
    { label: "1H FUNDING", value: "0.000000%", className: "text-green" },
    { label: "FUNDING APY", value: "0%", className: "text-green" },
  ];

  return (
    <div className="flex items-center gap-8 px-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col gap-0.5 min-w-26 ${stat.className || ""}`}
        >
          <div className="flex flex-1 items-center justify-start font-mono text-sm capitalize text-vestgrey-100">
            {stat.label}
          </div>
          <div
            className={`flex flex-1 items-center justify-start text-xl ${
              stat.className || "text-vestgrey-50"
            }`}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarketStats;
