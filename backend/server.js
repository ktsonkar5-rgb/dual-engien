require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Serve static frontend files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Dual Engine E-Commerce Backend is Running"
    });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT) || 5000;

// Start server immediately so Railway health check can pass
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Connect to DB asynchronously — don't block startup
connectDB().catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});
