const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  keywords: { type: [String], default: [] }
});

module.exports = mongoose.model("Faq", faqSchema);


