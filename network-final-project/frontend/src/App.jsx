import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Shop from "./pages/shop";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
