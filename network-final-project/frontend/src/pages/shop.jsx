import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000/api/products";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(keyword));
  }, [products, q]);

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="brand">🛍️ 商品展示</div>
          <div className="subtitle">瀏覽商品，點卡片看詳情</div>
        </div>

        <div className="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋商品…" />
          <span className="pill">{filtered.length} items</span>
          <Link className="pill" to="/admin">管理後台</Link>
        </div>
      </header>

      <section className="gridWrap">
        <div className="gridTitle">
          熱門商品 {loading ? <span className="muted">載入中…</span> : null}
        </div>

        <div className="grid">
          {filtered.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: "none" }}>
              <div className="card">
                <div className="thumb">
                  <img src={p.imageUrl} alt={p.name} />
                </div>
                <div className="cardBody">
                  <div className="name">{p.name}</div>
                  <div className="price">NT$ {p.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 ? (
          <div className="empty" style={{ marginTop: 14 }}>
            <div className="emptyIcon">📦</div>
            <div className="emptyTitle">目前沒有商品</div>
            <div className="emptyText">去「管理後台」新增一筆吧。</div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
