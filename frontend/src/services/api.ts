import axios from "axios";
import { KLine } from "../utils/types";

const BASE_URL = "http://localhost:7000";

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime?: number,
  limit?: number
): Promise<KLine[]> {
  if (!endTime) {
    endTime = new Date().getTime();
  }

  if (!limit) {
    limit = 20;
  }

  // Fetching data from the server
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`
  );

  // Converting the data to the correct KLine format
  const klines: KLine[] = response.data.map(
    (item: Array<string | number>[]) => ({
      start: item[0], // Open time
      open: item[1], // Open price
      high: item[2], // High price
      low: item[3], // Low price
      close: item[4], // Close price
      end: item[5], // Close time
      volume: item[6], // Volume
      quoteVolume: item[7], // Quote volume
      trades: item[8], // Number of trades
    })
  );

  // Sorting the data by the end time (ascending order)
  const sortedData = klines.sort((x, y) => (x.end < y.end ? -1 : 1));

  // Removing duplicate entries
  const filteredData = sortedData.filter((item, index, self) => {
    return index === self.findIndex((t) => t.end === item.end);
  });

  return filteredData;
}
