const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  matchedQuestion: String,
  matchedAnswer: String,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", conversationSchema);
