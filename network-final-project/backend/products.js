const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("./db");

const router = express.Router();

/**
 * Create - 新增商品
 * POST /api/products
 * body: { name, price, imageUrl }
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    if (!name || price === undefined || !imageUrl) {
      return res.status(400).json({ message: "缺少必要欄位" });
    }

    const db = await connectDB();
    const result = await db.collection("products").insertOne({
      name,
      price: Number(price),
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "商品新增成功",
      productId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: "新增失敗", error: err.message });
  }
});

/**
 * Read - 取得所有商品
 * GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "讀取失敗", error: err.message });
  }
});

/**
 * Read - 取得單一商品
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id 格式錯誤" });

    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    if (!product) return res.status(404).json({ message: "找不到商品" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "讀取失敗", error: err.message });
  }
});

/**
 * Update - 更新商品
 * PUT /api/products/:id
 * body: { name?, price?, imageUrl? }
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id 格式錯誤" });

    const { name, price, imageUrl } = req.body;

    // 至少要有一個欄位要更新
    if (name === undefined && price === undefined && imageUrl === undefined) {
      return res.status(400).json({ message: "沒有提供要更新的欄位" });
    }

    const updateDoc = { updatedAt: new Date() };
    if (name !== undefined) updateDoc.name = name;
    if (price !== undefined) updateDoc.price = Number(price);
    if (imageUrl !== undefined) updateDoc.imageUrl = imageUrl;

    const db = await connectDB();
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "找不到商品" });

    res.json({ message: "更新成功" });
  } catch (err) {
    res.status(500).json({ message: "更新失敗", error: err.message });
  }
});

/**
 * Delete - 刪除商品
 * DELETE /api/products/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "id 格式錯誤" });

    const db = await connectDB();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).json({ message: "找不到商品" });

    res.json({ message: "刪除成功" });
  } catch (err) {
    res.status(500).json({ message: "刪除失敗", error: err.message });
  }
});

module.exports = router;
