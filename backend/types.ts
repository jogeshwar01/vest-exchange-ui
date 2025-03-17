export type EmojiReaction = {
  userId: string;
  emoji: string;
};

export type EmojiReactions = {
  [timestamp: string]: EmojiReaction[];
};
