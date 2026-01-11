# API 規格說明文件  
商品管理系統（Product Management System）

---

## 一、API 基本資訊

- **Base URL**
http://localhost:3000/api
- **資料格式**
- Request / Response 皆使用 JSON
- Content-Type：`application/json`

---

## 二、商品 API（Products）

---

### 1. 取得所有商品

- **路由**
GET /products

- **說明**
取得系統中所有商品資料。

- **Request 參數**
無

- **Response 範例**
```json
[
  {
    "_id": "65f1a1b2c3d4",
    "name": "測試商品",
    "price": 999,
    "imageUrl": "https://via.placeholder.com/600x400"
  }
]
2. 新增商品
- **路由**
POST /products
說明
新增一筆商品資料至資料庫。

Request Body
{
  "name": "Logitech 滑鼠",
  "price": 990,
  "imageUrl": "https://example.com/mouse.jpg"
}
Response 範例
{
  "acknowledged": true,
  "insertedId": "65f1b2c3d4e5"
}
3️⃣ 更新商品
API 路由

PUT /products/:id
說明
依商品 ID 更新指定商品資料。
Path Parameter

參數	說明
id	商品 ID（MongoDB ObjectId）
Request Body

{
  "name": "Logitech 機械滑鼠",
  "price": 1290,
  "imageUrl": "https://example.com/newmouse.jpg"
}
Response 範例

{
  "modifiedCount": 1
}
4️⃣ 刪除商品

API 路由

DELETE /products/:id


說明
依商品 ID 刪除指定商品。

Path Parameter

參數	說明
id	商品 ID（MongoDB ObjectId）
Response 範例

{
  "deletedCount": 1
}
三、錯誤處理說明
500 Internal Server Error

說明
當伺服器發生錯誤時回傳。

Response 範例

{
  "error": "Server error"
}
四、API 使用說明補充

本 API 為 RESTful API 設計

前端透過 Fetch API 呼叫上述 API

API 與 MongoDB 資料庫進行資料存取

實際應用於商品管理系統之 CRUD 功能