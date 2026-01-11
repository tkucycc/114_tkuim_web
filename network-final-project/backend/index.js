const express = require("express");
const cors = require("cors");
const productRoutes = require("./products");
const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ✅ 掛上商品路由（沒有這行就會 Cannot POST /api/products）
app.use("/api/products", productRoutes);

// 測試 API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

// 啟動伺服器 + DB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
  });
