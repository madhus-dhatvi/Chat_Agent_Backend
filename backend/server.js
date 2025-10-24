// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// // Import routes
// const ordersRoutes = require("./routes/ordersRoutes");
// const faqsRoutes = require("./routes/faqsRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Base route
// app.get("/", (req, res) => {
//   res.send("E-commerce Backend API is running...");
// });

// // Orders routes
// app.use("/api/orders", ordersRoutes);

// // FAQs routes
// app.use("/api/faqs", faqsRoutes);

// // Serve static JSON files (optional, useful for testing)
// app.use("/faqs-json", express.static(path.join(__dirname, "config/faqs")));

// // Error handling for unknown routes
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found." });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const faqsRoutes = require("./routes/faqsRoutes");
const connectDB = require("./lib/connectDB");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;



// MongoDB connection
// mongoose.connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

connectDB()

// Routes
app.get("/", (req, res) => res.send("Chat Agent Backend Running"));
app.use("/api/faqs", faqsRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
