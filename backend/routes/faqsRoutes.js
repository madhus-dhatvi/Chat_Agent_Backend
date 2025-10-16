const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const categories = [
  "cancellation",
  "coupons",
  "feedback",
  "general_inquiry", // updated to match the JSON file
  "giftcard",
  "okalspecials",
  "okalsupersaver",
  "orders_and_products",
  "payment",
  "refund_and_replacement",
  "wallet"
];


router.get("/:category", (req, res) => {
  const category = req.params.category.toLowerCase().replace(/[\s-]/g, "_");
  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid FAQ category." });
  }

  const filePath = path.join(__dirname, "../config/faqs", `${category}.json`);

  if (!fs.existsSync(filePath)) {
    return res.json({ faqs: [] });
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const faqs = JSON.parse(data);
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Error reading FAQs.", error: err.message });
  }
});

module.exports = router;
