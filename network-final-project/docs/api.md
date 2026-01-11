# API 規格說明文件  
商品管理系統（Product Management System）

---

一、API 基本資訊

Base URL
http://localhost:3000/api

資料格式
Request / Response 皆使用 JSON
Content-Type: application/json

二、商品 API（Products）
1. 取得所有商品

Method：GET
URL：/products

說明
取得系統中所有商品資料。

Response 範例

{
  "success": true,
  "data": [
    {
      "_id": "65f1a1b2c3d4",
      "name": "測試商品",
      "price": 999,
      "imageUrl": "https://via.placeholder.com/600x400"
    }
  ]
}

2. 取得單一商品

Method：GET
URL：/products/:id

說明
依商品 ID 取得單一商品詳細資料。

Path Parameter

參數	說明
id	商品 ID（MongoDB ObjectId）

Response 範例

{
  "success": true,
  "data": {
    "_id": "65f1a1b2c3d4",
    "name": "測試商品",
    "price": 999,
    "imageUrl": "https://via.placeholder.com/600x400"
  }
}

3. 新增商品

Method：POST
URL：/products

Request Body

{
  "name": "Logitech 滑鼠",
  "price": 990,
  "imageUrl": "https://example.com/mouse.jpg"
}


Response 範例

{
  "success": true,
  "data": {
    "insertedId": "65f1b2c3d4e5"
  }
}

4. 更新商品

Method：PUT
URL：/products/:id

Request Body

{
  "name": "Logitech 機械滑鼠",
  "price": 1290,
  "imageUrl": "https://example.com/newmouse.jpg"
}


Response 範例

{
  "success": true,
  "data": {
    "modifiedCount": 1
  }
}

5. 刪除商品

Method：DELETE
URL：/products/:id

Response 範例

{
  "success": true,
  "data": {
    "deletedCount": 1
  }
}

三、錯誤處理說明
500 Internal Server Error
{
  "success": false,
  "message": "Server error"
}

四、補充說明

本 API 採 RESTful API 設計

前端透過 Fetch API 呼叫

API 實際與 MongoDB 進行 CRUD 操作

實際應用於商品管理系統後台管理功能