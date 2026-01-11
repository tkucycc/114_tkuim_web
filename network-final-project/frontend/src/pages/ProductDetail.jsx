import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/products";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  
useEffect(() => {
  (async () => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    if (!res.ok) {
      setProduct(null);
      return;
    }
    const data = await res.json();
    setProduct(data);
  })();
}, [id]);


  if (!product) {
    return (
      <div className="container">
        <section className="panel">
          <div className="panelTitle">找不到商品</div>
          <div className="search" style={{ justifyContent: "flex-start" }}>
            <Link className="pill" to="/">回商品展示</Link>
            <Link className="pill" to="/admin">管理後台</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="brand">🧾 商品詳情</div>
          <div className="subtitle">{product.name}</div>
        </div>

        <div className="search">
          <Link className="pill" to="/">回商品展示</Link>
          <Link className="pill" to="/admin">管理後台</Link>
        </div>
      </header>

      <section className="panel">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <div className="thumb" style={{ height: 360, borderRadius: 16, overflow: "hidden" }}>
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <div>
            <div className="panelTitle" style={{ fontSize: 20 }}>{product.name}</div>
            <div className="price" style={{ fontSize: 18 }}>NT$ {product.price}</div>
            <div className="meta" style={{ marginTop: 10 }}>商品ID：{product._id}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
