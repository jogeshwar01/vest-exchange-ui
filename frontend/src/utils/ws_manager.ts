import { WEBSOCKET_SERVER_URL } from "./constants";

export class WsManager {
  private ws: WebSocket;
  private static instance: WsManager;
  private bufferedMessages: any[] = [];
  private callbacks: any = {};
  private initialized: boolean = false;

  private constructor() {
    this.ws = new WebSocket(WEBSOCKET_SERVER_URL);
    this.bufferedMessages = [];
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WsManager();
    }
    return this.instance;
  }

  async init() {
    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((message) => {
        this.ws.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };

    this.ws.onmessage = async (event) => {
      const messageData: Blob = event.data;
      const arrayBuffer = await messageData.arrayBuffer();
      const decoder = new TextDecoder("utf-8");
      const decodedStr = decoder.decode(new Uint8Array(arrayBuffer));

      try {
        const messageJson = JSON.parse(decodedStr);
        const channelType =
          messageJson?.channel?.split("@")?.[1] || messageJson.channel;

        if (this.callbacks[channelType]) {
          this.callbacks[channelType].forEach(
            ({ callback, channel }: { callback: any; channel: string }) => {
              if (channelType === "depth" && channel === messageJson.channel) {
                const updatedBids = messageJson.data.bids;
                const updatedAsks = messageJson.data.asks;
                callback({ bids: updatedBids, asks: updatedAsks });
              }

              if (channelType === "trades" && channel === messageJson.channel) {
                const trades = messageJson.data;
                callback(trades);
              }

              if (
                channelType === "tickers" &&
                channel === messageJson.channel
              ) {
                const tickers = messageJson.data;
                callback(tickers);
              }

              if (
                channelType?.startsWith("kline") &&
                channel === messageJson.channel
              ) {
                const klineData = messageJson.data;
                callback(klineData);
              }
            }
          );
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };
  }

  sendMessage(message: any) {
    const currentTimeStamp = new Date().getTime();
    const messageToSend = {
      ...message,
      id: currentTimeStamp,
    };
    if (!this.initialized) {
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.ws.send(JSON.stringify(messageToSend));
  }

  async registerCallback(type: string, callback: any, channel: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, channel });
  }

  async deRegisterCallback(type: string, channel: string) {
    if (this.callbacks[type]) {
      const index = this.callbacks[type].findIndex(
        (callback: any) => callback.channel === channel
      );
      if (index !== -1) {
        this.callbacks[type].splice(index, 1);
      }
    }
  }
}
