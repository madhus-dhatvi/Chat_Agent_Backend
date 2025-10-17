// // const express = require("express");
// // const router = express.Router();
// // const fs = require("fs");
// // const path = require("path");

// // const categories = [
// //   "cancellation",
// //   "coupons",
// //   "feedback",
// //   "general_inquiry", // updated to match the JSON file
// //   "giftcard",
// //   "okalspecials",
// //   "okalsupersaver",
// //   "orders_and_products",
// //   "payment",
// //   "refund_and_replacement",
// //   "wallet"
// // ];


// // router.get("/:category", (req, res) => {
// //   const category = req.params.category.toLowerCase().replace(/[\s-]/g, "_");
// //   if (!categories.includes(category)) {
// //     return res.status(400).json({ message: "Invalid FAQ category." });
// //   }

// //   const filePath = path.join(__dirname, "../config/faqs", `${category}.json`);

// //   if (!fs.existsSync(filePath)) {
// //     return res.json({ faqs: [] });
// //   }

// //   try {
// //     const data = fs.readFileSync(filePath, "utf8");
// //     const faqs = JSON.parse(data);
// //     res.json(faqs);
// //   } catch (err) {
// //     res.status(500).json({ message: "Error reading FAQs.", error: err.message });
// //   }
// // });
// // const faqs = JSON.parse(fs.readFileSync(filePath, "utf8"));
// //   res.json(faqs);


// // // Endpoint to list all categories
// // router.get("/", (req, res) => {
// //   res.json({
// //     categories
// //   });
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");

// // debug route - temporarily add this
// router.get("/_debug/list-files", (req, res) => {
//   const dir = path.join(__dirname, "../config/faqs");
//   if (!fs.existsSync(dir)) return res.json({ ok: false, message: "faqs dir missing", dir });
//   const files = fs.readdirSync(dir);
//   // Normalize filenames for easier comparison
//   const normalized = files.map(f => f.toLowerCase());
//   // categories expected (same as your categories array)
//   const expected = [
//     "cancellation",
//     "coupons",
//     "feedback",
//     "general_inquiry",
//     "giftcard",
//     "okalspecials",
//     "okalsupersaver",
//     "orders_and_products",
//     "payment",
//     "refund_and_replacement",
//     "wallet"
//   ];
//   const missing = expected.filter(cat => !normalized.includes(`${cat}.json`));
//   res.json({ ok: true, dir, files, missing });
// });


// // All FAQ categories
// const categories = [
//   "cancellation",
//   "coupons",
//   "feedback",
//   "general_inquiry",
//   "giftcard",
//   "okalspecials",
//   "okalsupersaver",
//   "orders_and_products",
//   "payment",
//   "returns_and_replacement",
//   "wallet"
// ];

// // Get FAQs by category
// router.get("/:category", (req, res) => {
//   const category = req.params.category.toLowerCase().replace(/[\s-]/g, "_");

//   if (!categories.includes(category)) {
//     return res.status(400).json({ message: "Invalid FAQ category." });
//   }

//   const filePath = path.join(__dirname, "../config/faqs", `${category}.json`);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "FAQ file not found." });
//   }

//   const faqs = JSON.parse(fs.readFileSync(filePath, "utf8"));
//   res.json(faqs);
// });

// // Endpoint to list all categories
// router.get("/", (req, res) => {
//   res.json({
//     categories
//   });
// });

// module.exports = router;
// routes/faqsRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const FAQ_DIR = path.join(__dirname, "../config/faqs");

// debug route - temporarily add this
router.get("/_debug/list-files", (req, res) => {
  const dir = FAQ_DIR;
  if (!fs.existsSync(dir)) return res.json({ ok: false, message: "faqs dir missing", dir });
  const files = fs.readdirSync(dir);
  const normalized = files.map(f => f.toLowerCase());
  const expected = [
    "cancellation",
    "coupons",
    "feedback",
    "general_inquiry",
    "giftcard",
    "okalspecials",
    "okalsupersaver",
    "orders_and_products",
    "payment",
    "Returns_and_replacement",
    "wallet"
  ];
  const missing = expected.filter(cat => !normalized.includes(`${cat}.json`));
  res.json({ ok: true, dir, files, missing });
});

// All FAQ categories (use canonical slugs)
const categories = [
  "cancellation",
  "coupons",
  "feedback",
  "general_inquiry",
  "giftcard",
  "okalspecials",
  "okalsupersaver",
  "orders_and_products",
  "payment",
  "Returns_and_replacement", // <-- corrected
  "wallet"
];

// Helper: normalize incoming slug -> canonical form (underscores, lower)
function normalizeSlug(slug) {
  return String(slug || "").toLowerCase().replace(/[\s-]+/g, "_");
}

// Helper: try to find a matching file in a case-insensitive / flexible way
function findFaqFile(category) {
  if (!fs.existsSync(FAQ_DIR)) return null;
  const files = fs.readdirSync(FAQ_DIR);
  const direct = `${category}.json`;

  // exact (case-sensitive) first
  if (files.includes(direct)) return path.join(FAQ_DIR, direct);

  // case-insensitive direct
  const ci = files.find(f => f.toLowerCase() === direct.toLowerCase());
  if (ci) return path.join(FAQ_DIR, ci);

  // flexible normalize: strip underscores/hyphens/spaces and compare
  const normalizeName = s => s.toLowerCase().replace(/[\s_-]/g, "");
  const matched = files.find(f => normalizeName(f) === normalizeName(direct));
  return matched ? path.join(FAQ_DIR, matched) : null;
}

// GET all categories (list)
router.get("/", (req, res) => {
  res.json({ categories });
});

// GET single category FAQs
router.get("/:category", (req, res) => {
  const raw = req.params.category;
  const category = normalizeSlug(raw);

  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid FAQ category.", category });
  }

  const filePath = findFaqFile(category);
  if (!filePath) {
    return res.status(404).json({ message: "FAQ file not found on server.", category });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error reading FAQ file.", error: err.message });
  }
});

module.exports = router;
