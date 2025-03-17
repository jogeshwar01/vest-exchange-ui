import express from "express";
import cors from "cors";
import { emojiReactions } from "./constants";

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

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
