# Network Final Project｜商品管理系統

## 一、專案簡介
本專案為「網路程式設計」期末專案，實作一個 **前後端分離的商品管理系統**。  
系統提供商品的 **新增（Create）、查詢（Read）、修改（Update）、刪除（Delete）** 功能，並透過 HTTP API 進行前後端資料交換。

使用者可於前台瀏覽商品資訊，管理者則可透過後台介面進行商品管理操作。

---

## 二、系統架構
本系統採用 **前後端分離架構**：

- **前端（Frontend）**
  - React + Vite
  - 負責畫面呈現與使用者互動
  - 透過 `fetch` 呼叫後端 API

- **後端（Backend）**
  - Node.js + Express
  - 提供 RESTful API
  - 與 MongoDB 資料庫連線，處理資料存取

- **資料庫（Database）**
  - MongoDB
  - 儲存商品資料（名稱、價格、圖片）

---

## 三、使用技術
### 前端
- React
- React Router
- HTML / CSS / JavaScript
- Fetch API

### 後端
- Node.js
- Express
- MongoDB
- RESTful API

---

## 四、功能說明
### 使用者功能
- 瀏覽商品列表
- 查看商品詳細資訊

### 管理者功能（後台）
- 新增商品
- 編輯商品
- 刪除商品
- 搜尋商品
- 即時更新商品列表（CRUD 完整流程）

---

## 五、專案資料夾結構
network-final-project/
├─ backend/
│ ├─ index.js
│ ├─ products.js
│ └─ package.json
├─ frontend/
│ ├─ src/
│ │ ├─ App.jsx
│ │ ├─ App.css
│ │ └─ pages/
│ │ ├─ Shop.jsx
│ │ ├─ ProductDetail.jsx
│ │ └─ Admin.jsx
│ └─ package.json
└─ docs/
└─ api.md

---

## 六、安裝與執行方式
### 1 啟動後端
```bash
cd backend
npm install
node index.js
執行於
http://localhost:3000
### 2 啟動前端
cd frontend
npm install
npm run dev
執行於
http://localhost:5173
