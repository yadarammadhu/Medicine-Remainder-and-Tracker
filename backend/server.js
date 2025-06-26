const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import DB connection
const morgan = require("morgan");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined")); 

const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/Medicine");

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);

app.get("/", (req, res) => {
  res.send("Smart Medicine Reminder API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
