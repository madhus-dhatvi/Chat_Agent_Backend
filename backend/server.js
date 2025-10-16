// const express = require("express");
// const cors = require("cors");
// const ordersRoutes = require("./routes/ordersRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Base route
// app.get("/", (req, res) => {
//   res.send(" E-commerce Orders API is running...");
// });

// // Orders routes
// app.use("/api/orders", ordersRoutes);

// // Error handling
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found." });
// });

// // Start server
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
// server.js
// const express = require("express");
// const cors = require("cors");
// const ordersRoutes = require("./routes/ordersRoutes"); // Your orders routes
// // const faqsRoutes = require("./routes/faqsRoutes");     // Optional FAQs routes

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Base route
// app.get("/", (req, res) => {
//   res.send("E-commerce Orders & FAQ API is running...");
// });

// // Orders routes
// app.use("/api/orders", ordersRoutes);

// // FAQs routes (optional)
// // app.use("/api/faqs", faqsRoutes);

// // 404 Error handling for unknown routes
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found." });
// });

// // Global error handler (optional, catches unexpected errors)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!", error: err.message });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const ordersRoutes = require("./routes/ordersRoutes");
const faqsRoutes = require("./routes/faqsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("E-commerce Backend API is running...");
});

// Orders routes
app.use("/api/orders", ordersRoutes);

// FAQs routes
app.use("/api/faqs", faqsRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
