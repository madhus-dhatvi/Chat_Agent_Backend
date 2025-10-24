// const mongoclient = require("mongodb");

// const connectDB = async()=> {
//     try {
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log("DB Connected")
//     } catch (error) {
//         console.log("database error", error)
//     }
// }

// module.exports=connectDB;


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1); // Stop server if DB connection fails
  }
};

module.exports = connectDB;
