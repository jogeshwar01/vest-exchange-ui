import { useContext, useState } from "react";
import { TradesContext } from "../../state/TradesProvider";
import { Ticker } from "../../utils/types";
import { useNavigate } from "react-router-dom";

function SelectTickerTable({
  setIsSelectOpen,
}: {
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { tickers } = useContext(TradesContext);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
  };

  const handleSelectTicker = (ticker: Ticker) => {
    setIsSelectOpen(false);
    navigate(`/trade/${ticker.symbol}`); // Navigate to the selected ticker's route
  };

  // Filter the tickers based on the search query
  const filteredTickers = tickers.filter((ticker) =>
    ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute left-0 mt-14 z-100 h-full max-h-[400px] overflow-hidden bg-background border border-border text-xs">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded z-200 focus:outline-none"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-[300px] text-nowrap bg-background border-t border-border">
          <thead className="sticky -top-1 bg-vestgrey-800 z-10">
            <tr className="text-left text-mono text-sm uppercase">
              <th className="w-1/5 cursor-pointer border-b-2 border-border bg-vestgrey-800 px-6 py-3">
                Symbol
              </th>
              <th className="w-1/5 cursor-pointer border-b-2 border-border bg-vestgrey-800 px-6 py-3">
                Mark Price
              </th>
              <th className="w-1/5 cursor-pointer border-b-2 border-border bg-vestgrey-800 px-6 py-3">
                24h Change
              </th>
              <th className="w-1/5 cursor-pointer border-b-2 border-border bg-vestgrey-800 px-6 py-3">
                1h Funding
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickers.length > 0 ? (
              filteredTickers.map((ticker) => (
                <tr
                  key={ticker.symbol}
                  className="group cursor-pointer"
                  onClick={() => handleSelectTicker(ticker)}
                >
                  <td className="px-6 py-2 font-mono text-vestgrey-50 group-hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <img
                        src="/tokens/star.svg"
                        alt="symbol"
                        className="h-4 w-4"
                      />
                      <span className="font-sans">{ticker.symbol}</span>
                      <div className="rounded bg-[#271714] px-2">
                        <span className="font-mono text-primary">50X</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 font-mono text-vestgrey-50 group-hover:bg-primary/5">
                    <span className="text-green">{ticker.markPrice}</span>
                  </td>
                  <td className="px-6 py-2 font-mono text-vestgrey-50 group-hover:bg-primary/5">
                    <span
                      className={
                        parseFloat(ticker.priceChangePercent) < 0
                          ? "text-red"
                          : "text-green"
                      }
                    >
                      {ticker.priceChange} / {ticker.priceChangePercent}%
                    </span>
                  </td>
                  <td className="px-6 py-2 font-mono text-vestgrey-50 group-hover:bg-primary/5">
                    <span className="text-green">
                      {ticker.oneHrFundingRate}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-2 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SelectTickerTable;
