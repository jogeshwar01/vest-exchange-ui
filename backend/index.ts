import express from "express";
import cors from "cors";
import { emojiReactions, VEST_PROD_API } from "./constants";
import axios from "axios";
import { vest_headers } from "./headers";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to add reactions (existing)
app.post("/addReaction", (req, res) => {
  const { timestamp, userId, emoji } = req.body;
  if (!emojiReactions[timestamp]) {
    emojiReactions[timestamp] = [];
  }
  emojiReactions[timestamp].push({ userId, emoji });
  res.status(200).send("Reaction added");
});

// Endpoint to get reactions (existing)
app.get("/getReactions", (req, res) => {
  res.json(emojiReactions);
});

// Proxy endpoint for Vest API (klines)
app.get("/klines", async (req, res) => {
  const { symbol, interval, startTime, endTime, limit } = req.query;

  try {
    // Build the URL for the Vest API request
    const url = `${VEST_PROD_API}/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=${limit}`;

    // Make the request to the Vest API
    const response = await axios.get(url, { headers: vest_headers });

    // Send the Vest API response back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching klines:", error);
    res.status(500).json({ error: "Failed to fetch klines from Vest API" });
  }
});

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
