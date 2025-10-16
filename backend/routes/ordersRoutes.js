// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");

// const dbPath = path.join(__dirname, "../config/orders.json");
// let db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// function daysBetween(date1, date2) {
//   return Math.floor((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
// }

// // Track Order
// router.get("/track/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });
//   res.json(order);
// });

// // Cancel Order
// router.post("/cancel/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   if (order.status !== "Pending") return res.json({ message: "Only pending orders can be cancelled." });

//   const buffer = order.options.pending.cancel_buffer_days;
//   const daysPassed = daysBetween(order.order_date, new Date());
//   if (daysPassed > buffer) return res.json({ message: "Cancellation period expired." });

//   order.status = "Cancelled";
//   fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
//   res.json({ message: "Order cancelled successfully." });
// });

// // Return Order
// const returnOrder = require("../config/returnOrder.json");
// // console.log(returnOrder.api.description);

// router.post("/return/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can be returned." });

//   const buffer = order.options.delivered.return_buffer_days;
//   const daysPassed = daysBetween(order.delivery_date, new Date());
//   if (daysPassed > buffer) return res.json({ message: "Return period expired." });

//   order.status = "Return Initiated";
//   fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
//   res.json({ message: "Return process initiated successfully." });
// });

// // Report Missing Item
// const reportMissingOrders = require("../config/reportMissingOrders.json");

// router.post("/missing/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can report missing items." });

//   const buffer = order.options.delivered.report_missing_item_buffer_days;
//   const daysPassed = daysBetween(order.delivery_date, new Date());
//   if (daysPassed > buffer) return res.json({ message: "Reporting period for missing items expired." });

//   res.json({ message: "Please specify the missing items. Reporting is allowed within buffer period." });
// });

// // Report Wrong Item
// router.post("/wrong/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can report wrong items." });

//   const buffer = order.options.delivered.report_wrong_item_buffer_days;
//   const daysPassed = daysBetween(order.delivery_date, new Date());
//   if (daysPassed > buffer) return res.json({ message: "Reporting period for wrong items expired." });

//   res.json({ message: "Please specify the wrong items. Reporting is allowed within buffer period." });
// });

// // Payment Details
// router.get("/payment/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   res.json({
//     payment_mode: order.payment_mode,
//     payment_status: order.payment_status,
//     total_amount: order.total_amount
//   });
// });

// // Refund
// router.post("/refund/:orderId", (req, res) => {
//   const order = db.orders.find(o => o.id === req.params.orderId);
//   if (!order) return res.status(404).json({ message: "Order not found." });

//   if (order.status !== "Return Initiated") return res.json({ message: "Refund can only be processed for returned orders." });

//   order.status = "Refund Initiated";
//   fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
//   res.json({ message: "Refund process initiated successfully." });
// });

// module.exports = router;

// routes/faqsRoutes.js
// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");

// // Categories list
// const categories = [
//   "cancellation",
//   "coupons-and-offers",
//   "feedback",
//   "general-inquiry",
//   "giftcard",
//   "okalspecials",
//   "okalsupersaver",
//   "orders-and-products",
//   "payment",
//   "refund-and-replacement",
//   "wallet"
// ];

// // Helper to get JSON file path for a category
// function getDbPath(category) {
//   return path.join(__dirname, `../config/faqs/${category}.json`);
// }

// // Helper to read JSON
// function readDb(category) {
//   const filePath = getDbPath(category);
//   if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ faqs: [] }, null, 2));
//   return JSON.parse(fs.readFileSync(filePath, "utf8"));
// }

// // Helper to write JSON
// function writeDb(category, data) {
//   fs.writeFileSync(getDbPath(category), JSON.stringify(data, null, 2));
// }

// // GET all FAQs for a category
// router.get("/:category", (req, res) => {
//   const { category } = req.params;
//   if (!categories.includes(category)) return res.status(400).json({ message: "Invalid category." });

//   const db = readDb(category);
//   res.json(db.faqs);
// });

// // GET single FAQ by ID
// router.get("/:category/:id", (req, res) => {
//   const { category, id } = req.params;
//   if (!categories.includes(category)) return res.status(400).json({ message: "Invalid category." });

//   const db = readDb(category);
//   const faq = db.faqs.find(f => f.id === id);
//   if (!faq) return res.status(404).json({ message: "FAQ not found." });

//   res.json(faq);
// });

// // POST new FAQ
// router.post("/:category", (req, res) => {
//   const { category } = req.params;
//   if (!categories.includes(category)) return res.status(400).json({ message: "Invalid category." });

//   const { question, answer } = req.body;
//   if (!question || !answer) return res.status(400).json({ message: "Question and answer required." });

//   const db = readDb(category);
//   const newFaq = {
//     id: "FAQ" + (db.faqs.length + 1).toString().padStart(3, "0"),
//     question,
//     answer
//   };
//   db.faqs.push(newFaq);
//   writeDb(category, db);

//   res.json({ message: "FAQ added successfully.", faq: newFaq });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../config/faqs/orders_and_products.json");
let db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

function daysBetween(date1, date2) {
  return Math.floor((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
}

// Track Order
router.get("/track/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json(order);
});

// Cancel Order
router.post("/cancel/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.status !== "Pending") return res.json({ message: "Only pending orders can be cancelled." });

  const buffer = order.options.pending.cancel_buffer_days;
  const daysPassed = daysBetween(order.order_date, new Date());
  if (daysPassed > buffer) return res.json({ message: "Cancellation period expired." });

  order.status = "Cancelled";
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ message: "Order cancelled successfully." });
});

// Return Order
router.post("/return/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can be returned." });

  const buffer = order.options.delivered.return_buffer_days;
  const daysPassed = daysBetween(order.delivery_date, new Date());
  if (daysPassed > buffer) return res.json({ message: "Return period expired." });

  order.status = "Return Initiated";
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ message: "Return process initiated successfully." });
});

// Report Missing Item
router.post("/missing/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can report missing items." });

  const buffer = order.options.delivered.report_missing_item_buffer_days;
  const daysPassed = daysBetween(order.delivery_date, new Date());
  if (daysPassed > buffer) return res.json({ message: "Reporting period for missing items expired." });

  res.json({ message: "Please specify the missing items. Reporting is allowed within buffer period." });
});

// Report Wrong Item
router.post("/wrong/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.status !== "Delivered") return res.json({ message: "Only delivered orders can report wrong items." });

  const buffer = order.options.delivered.report_wrong_item_buffer_days;
  const daysPassed = daysBetween(order.delivery_date, new Date());
  if (daysPassed > buffer) return res.json({ message: "Reporting period for wrong items expired." });

  res.json({ message: "Please specify the wrong items. Reporting is allowed within buffer period." });
});

// Payment Details
router.get("/payment/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  res.json({
    payment_mode: order.payment_mode,
    payment_status: order.payment_status,
    total_amount: order.total_amount
  });
});

// Refund
router.post("/refund/:orderId", (req, res) => {
  const order = db.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found." });

  if (order.status !== "Return Initiated") return res.json({ message: "Refund can only be processed for returned orders." });

  order.status = "Refund Initiated";
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ message: "Refund process initiated successfully." });
});

module.exports = router;
