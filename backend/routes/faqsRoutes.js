// // // routes/faqsRoutes.js
// // const express = require("express");
// // const router = express.Router();
// // const fs = require("fs");
// // const path = require("path");

// // const FAQ_DIR = path.join(__dirname, "../config/faqs");

// // // Correct categories array
// // const categories = [
// //   "cancellation",
// //   "coupons",
// //   "feedback",
// //   "general_enquiry",
// //   "giftcard",
// //   "okalspecials",
// //   "okalsupersaver",
// //   "orders_and_products",
// //   "payment",
// //   "return_and_replacement", // fixed
// //   "wallet"
// // ];

// // // Helper: normalize slug
// // function normalizeSlug(slug) {
// //   return String(slug || "").toLowerCase().replace(/[\s-]+/g, "_");
// // }

// // // Helper: find FAQ file (case-insensitive, flexible)
// // function findFaqFile(category) {
// //   if (!fs.existsSync(FAQ_DIR)) return null;
// //   const files = fs.readdirSync(FAQ_DIR);
// //   const normalizeName = name => name.toLowerCase().replace(/[\s_-]/g, "");

// //   const matchedFile = files.find(f => normalizeName(f) === normalizeName(`${category}.json`));
// //   return matchedFile ? path.join(FAQ_DIR, matchedFile) : null;
// // }

// // // GET all categories
// // router.get("/", (req, res) => {
// //   res.json({ categories });
// // });

// // // GET FAQs by category
// // router.get("/:category", (req, res) => {
// //   const category = normalizeSlug(req.params.category);

// //   if (!categories.includes(category)) {
// //     return res.status(400).json({ message: "Invalid FAQ category.", category });
// //   }

// //   const filePath = findFaqFile(category);
// //   if (!filePath) {
// //     return res.status(404).json({ message: "FAQ file not found.", category });
// //   }

// //   try {
// //     const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
// //     return res.json(data);
// //   } catch (err) {
// //     return res.status(500).json({ message: "Error reading FAQ file.", error: err.message });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Faq = require("../models/Faq");
// const Conversation = require("../models/Conversation");

// // Simple text tokenizer
// function tokenize(text) {
//   return String(text || "")
//     .toLowerCase()
//     .replace(/[^a-z0-9\s]/g, " ")
//     .split(/\s+/)
//     .filter(Boolean);
// }

// // Similarity score
// function overlapScore(tokensA, tokensB) {
//   const setB = new Set(tokensB);
//   let matches = 0;
//   for (const t of tokensA) if (setB.has(t)) matches++;
//   const denom = (tokensA.length + tokensB.length) / 2 || 1;
//   return matches / denom;
// }

// // POST /api/faqs/add
// router.post("/add", async (req, res) => {
//   try {
//     const { category, question, answer, keywords } = req.body;
//     const faq = await Faq.create({
//       category,
//       question,
//       answer,
//       keywords: (keywords || []).map(k => k.toLowerCase())
//     });
//     res.json({ message: "FAQ added successfully", faq });
//   } catch (err) {
//     res.status(500).json({ message: "Error adding FAQ", error: err.message });
//   }
// });

// // POST /api/faqs/query
// router.post("/query", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ message: "Message required" });

//     const allFaqs = await Faq.find();
//     const msgTokens = tokenize(message);

//     const results = allFaqs.map(f => {
//       const qTokens = tokenize(f.question);
//       const kwTokens = (f.keywords || []).map(k => k.toLowerCase());
//       const scoreQ = overlapScore(msgTokens, qTokens);
//       const scoreKW = overlapScore(msgTokens, kwTokens);
//       const score = (0.7 * scoreQ) + (0.3 * scoreKW);
//       return { faq: f, score };
//     });

//     results.sort((a, b) => b.score - a.score);
//     const top = results[0];

//     if (top && top.score > 0.05) {
//       await Conversation.create({
//         userMessage: message,
//         matchedQuestion: top.faq.question,
//         matchedAnswer: top.faq.answer,
//         score: top.score
//       });
//       return res.json({
//         matched: true,
//         question: top.faq.question,
//         answer: top.faq.answer,
//         score: top.score
//       });
//     } else {
//       await Conversation.create({
//         userMessage: message,
//         matchedQuestion: null,
//         matchedAnswer: null,
//         score: 0
//       });
//       return res.json({
//         matched: false,
//         message: "Sorry, I couldn’t find a matching FAQ. Try rephrasing your question."
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Error processing query", error: err.message });
//   }
// });

// module.exports = router;
// routes/faqsRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Faq = require("../models/Faq")

// Try to load Mongoose models if available
// let Faq, Conversation;
// try {
//   Faq = require("../models/Faq");
//   Conversation = require("../models/Conversation");
// } catch (e) {
//   // models not available / not using DB yet
//   Faq = null;
//   Conversation = null;
// }



const FAQ_DIR = path.join(__dirname, "../config/faqs");

// Canonical category list (fallback)
const CATEGORIES = [
  "cancellation",
  "coupons",
  "feedback",
  "general_inquiry",
  "giftcard",
  "okalspecials",
  "okalsupersaver",
  "orders_and_products",
  "payment",
  "return_and_replacement",
  "wallet"
];

// ----------------- helpers -----------------
function normalizeSlug(slug) {
  return String(slug || "").toLowerCase().replace(/[\s-]+/g, "_");
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function findFaqFile(category) {
  if (!fs.existsSync(FAQ_DIR)) return null;
  const files = fs.readdirSync(FAQ_DIR);
  const normalizeName = name => name.toLowerCase().replace(/[\s_-]/g, "");
  const target = normalizeName(`${category}.json`);
  const matched = files.find(f => normalizeName(f) === target);
  return matched ? path.join(FAQ_DIR, matched) : null;
}

// simple tokenizer & overlap score (used for /query)
function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
function overlapScore(tokensA, tokensB) {
  const setB = new Set(tokensB);
  let matches = 0;
  for (const t of tokensA) if (setB.has(t)) matches++;
  const denom = (tokensA.length + tokensB.length) / 2 || 1;
  return matches / denom;
}

// ----------------- routes -----------------

// Debug: list JSON files on disk
router.get("/_debug/list-files", (req, res) => {
  if (!fs.existsSync(FAQ_DIR)) return res.json({ ok: false, message: "faqs dir missing", dir: FAQ_DIR });
  const files = fs.readdirSync(FAQ_DIR);
  res.json({ ok: true, dir: FAQ_DIR, files });
});

// GET categories
// If DB is available return distinct categories from DB, otherwise return canonical list
router.get("/", async (req, res) => {
  if (Faq) {
    try {
      const cats = await Faq.distinct("category");
      // if DB empty, fall back to canonical
      return res.json({ categories: cats.length ? cats : CATEGORIES });
    } catch (err) {
      return res.status(500).json({ message: "DB error fetching categories", error: err.message });
    }
  }
  return res.json({ categories: CATEGORIES });
});

// GET FAQs by category (DB first, fallback to JSON file)
router.get("/:category", async (req, res) => {
  const raw = req.params.category;
  const category = normalizeSlug(raw);

  // Accept categories even if not listed in canonical array
  // Try DB if available
  if (Faq) {
    try {
      const docs = await Faq.find({ category }).select("-__v").lean();
      if (docs && docs.length) return res.json({ source: "db", category, faqs: docs });
      // no docs in DB -> fall through to file fallback
    } catch (err) {
      // continue to file fallback
      console.warn("DB fetch error, falling back to JSON:", err.message);
    }
  }

  // File fallback
  const filePath = findFaqFile(category);
  if (!filePath) return res.status(404).json({ message: "FAQ file not found.", category });

  const data = readJsonFile(filePath);
  if (!data) return res.status(500).json({ message: "Error reading FAQ file.", category });
  // ensure we return faqs array
  return res.json({ source: "file", category, faqs: data.faqs || data });
});

// POST add single FAQ to DB
// body: { category, question, answer, keywords?: [] }
router.post("/add", async (req, res) => {
  if (!Faq) return res.status(500).json({ message: "DB models not available. Start with mongoose models." });

  const { category, question, answer, keywords } = req.body;
  if (!category || !question || !answer) return res.status(400).json({ message: "category, question and answer required" });

  try {
    // const doc = await Faq.create({
    //   category: normalizeSlug(category),
    //   question: question.trim(),
    //   answer: answer.trim(),
    //   keywords: (keywords || []).map(k => String(k).toLowerCase())
    // });
    const newFaq = new Faq({
        category: normalizeSlug(category),
      question: question.trim(),
      answer: answer.trim(),
      keywords: (keywords || []).map(k => String(k).toLowerCase())
    })
    const doc1 = await newFaq.save()
    return res.json({ message: "FAQ added", faq: doc1 });
  } catch (err) {
    return res.status(500).json({ message: "Error adding FAQ", error: err.message });
  }
});



// POST bulk import all JSON files into MongoDB
// Use in Thunder Client: POST http://localhost:5000/api/faqs/bulk-import
// This reads all files in config/faqs and upserts them into DB (only when Faq model exists)
router.post("/bulk-import", async (req, res) => {
  if (!Faq) return res.status(500).json({ message: "DB models not available. Cannot bulk import." });
  if (!fs.existsSync(FAQ_DIR)) return res.status(500).json({ message: "FAQ dir not found", dir: FAQ_DIR });

  try {
    const files = fs.readdirSync(FAQ_DIR).filter(f => f.toLowerCase().endsWith(".json"));
    let total = 0, inserted = 0, updated = 0, skipped = 0;
    for (const file of files) {
      total++;
      const filePath = path.join(FAQ_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      // support two shapes: { category: "...", faqs: [...] } or array/object directly
      const faqsArray = Array.isArray(parsed) ? parsed : (parsed.faqs || []);
      // determine category: prefer normalized filename if not present inside
      const baseName = path.basename(file, ".json");
      const fileCategory = normalizeSlug(baseName);

      if (!faqsArray.length) {
        skipped++;
        continue;
      }

      for (const f of faqsArray) {
        const category = normalizeSlug(parsed.category || f.category || fileCategory || "misc");
        const question = f.question || f.q || "";
        const answer = f.answer || f.a || "";
        if (!question || !answer) { skipped++; continue; }
        const keywords = (f.keywords || []).map(k => String(k).toLowerCase());

        // upsert based on exact question + category
        const existing = await Faq.findOne({ category, question: question.trim() });
        if (existing) {
          existing.answer = answer.trim();
          existing.keywords = Array.from(new Set([...(existing.keywords || []), ...keywords]));
          await existing.save();
          updated++;
        } else {
          await Faq.create({ category, question: question.trim(), answer: answer.trim(), keywords });
          inserted++;
        }
      }
    }

    return res.json({ message: "Bulk import complete", totalFiles: total, inserted, updated, skipped });
  } catch (err) {
    return res.status(500).json({ message: "Bulk import failed", error: err.message });
  }
});

// GET search using regex across question/answer/keywords
// /api/faqs/search?q=cancel&category=orders
router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = req.query.category ? normalizeSlug(req.query.category) : null;
  if (!q) return res.status(400).json({ message: "Query parameter 'q' required" });

  if (!Faq) return res.status(500).json({ message: "DB not configured. Use file-based GET by category." });

  try {
    const regex = new RegExp(q, "i");
    const filter = {
      $or: [
        { question: { $regex: regex } },
        { answer: { $regex: regex } },
        { keywords: { $regex: regex } }
      ]
    };
    if (category) filter.category = category;
    const results = await Faq.find(filter).limit(200).lean();
    return res.json({ query: q, category: category || "any", total: results.length, results });
  } catch (err) {
    return res.status(500).json({ message: "Search failed", error: err.message });
  }
});

// POST query - chat-style: returns top N matches using token overlap scoring and logs conversation
// body: { message: "where's my order", category?: "orders", top?: 3 }
router.post("/query", async (req, res) => {
 
  const message = String(req.body.message || "").trim();
  const category = req.body.category ? normalizeSlug(req.body.category) : null;
  const top = parseInt(req.body.top || 1, 10);

  if (!message) return res.status(400).json({ message: "message is required" });

  // Candidate source: prefer DB, else try file-by-file search
  let candidates = [];
  if (Faq) {
    const dbFilter = category ? { category } : {};
    // fetch up to 1000 candidates (adjust as needed)
    candidates = await Faq.find(dbFilter).limit(1000).lean();
  } else {
    // if no DB, search JSON files and gather FAQs
    const files = fs.existsSync(FAQ_DIR) ? fs.readdirSync(FAQ_DIR) : [];
    for (const file of files) {
      if (!file.toLowerCase().endsWith(".json")) continue;
      const filePath = path.join(FAQ_DIR, file);
      const parsed = readJsonFile(filePath);
      const arr = Array.isArray(parsed) ? parsed : (parsed.faqs || []);
      const fileCategory = normalizeSlug(parsed.category || path.basename(file, ".json"));
      for (const f of arr) {
        const cat = normalizeSlug(f.category || fileCategory);
        if (category && cat !== category) continue;
        candidates.push({
          _id: `${file}::${Math.random().toString(36).slice(2,9)}`,
          category: cat,
          question: f.question,
          answer: f.answer,
          keywords: (f.keywords || []).map(k => String(k).toLowerCase())
        });
      }
    }
  }

  // Score candidates
  const msgTokens = tokenize(message);
  const scored = candidates.map(c => {
    const qTokens = tokenize(c.question || "");
    const aTokens = tokenize(c.answer || "");
    const kwTokens = (c.keywords || []).map(k => String(k).toLowerCase());
    const sQ = overlapScore(msgTokens, qTokens);
    const sA = overlapScore(msgTokens, aTokens);
    const kwMatches = msgTokens.filter(t => kwTokens.includes(t)).length;
    const sKW = kwMatches / (kwTokens.length || 1);
    const score = (0.5 * sQ) + (0.3 * sA) + (0.2 * sKW);
    return { faq: c, score };
  });

  scored.sort((a,b) => b.score - a.score);
  const threshold = 0.05; // change to tune sensitivity
  const topResults = scored.filter(s => s.score >= threshold).slice(0, top);

  // Log conversation if Conversation model exists
  let conv = null;
  try {
    if (Conversation) {
      if (topResults.length > 0) {
        const best = topResults[0];
        conv = await Conversation.create({
          userMessage: message,
          matchedFaqId: best.faq._id,
          matchedQuestion: best.faq.question,
          matchedAnswer: best.faq.answer,
          score: best.score,
          category: best.faq.category
        });
      } else {
        conv = await Conversation.create({
          userMessage: message,
          matchedFaqId: null,
          matchedQuestion: null,
          matchedAnswer: null,
          score: 0,
          category: category || null
        });
      }
    }
  } catch (err) {
    // don't fail query if logging fails
    console.warn("Conversation log failed:", err.message);
  }

  // Return results
  if (topResults.length === 0) {
    return res.json({
      query: message,
      category: category || "any",
      matchedCount: 0,
      results: [],
      conversationId: conv ? conv._id : null,
      message: "No confident match found. Try rephrasing."
    });
  }

  return res.json({
    query: message,
    category: category || "any",
    matchedCount: topResults.length,
    results: topResults.map(r => ({
      id: r.faq._id,
      category: r.faq.category,
      question: r.faq.question,
      answer: r.faq.answer,
      score: Number(r.score.toFixed(4))
    })),
    conversationId: conv ? conv._id : null
  });
});

module.exports = router;
