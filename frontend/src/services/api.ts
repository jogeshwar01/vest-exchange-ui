import axios from "axios";
import { KLine } from "../utils/types";

const BASE_URL = "https://serverprod.vest.exchange/v2";

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
    limit = 331;
  }

  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`
  );
  const data: KLine[] = response.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
