import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:3000/api/products";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState(null); // 👈 是否正在編輯
  const [form, setForm] = useState({ name: "", price: "", imageUrl: "" });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setMsg("❌ 讀取失敗：請確認後端 http://localhost:3000 有開");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((p) => (p.name || "").toLowerCase().includes(keyword));
  }, [products, q]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", price: "", imageUrl: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.name || !form.price || !form.imageUrl) {
      setMsg("⚠️ 請把「名稱 / 價格 / 圖片」都填好");
      return;
    }

    try {
      // ✅ 有 editingId 代表更新，沒有代表新增
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          imageUrl: form.imageUrl,
        }),
      });

      if (!res.ok) throw new Error();

      setMsg(editingId ? "✅ 更新成功！" : "✅ 新增成功！");
      resetForm();
      loadProducts();
    } catch {
      setMsg(editingId ? "❌ 更新失敗" : "❌ 新增失敗");
    }
  };

  const onEdit = (p) => {
    setMsg("");
    setEditingId(p._id);
    setForm({
      name: p.name ?? "",
      price: p.price ?? "",
      imageUrl: p.imageUrl ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (p) => {
    const ok = confirm(`確定要刪除「${p.name}」嗎？`);
    if (!ok) return;

    setMsg("");
    try {
      const res = await fetch(`${API}/${p._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setMsg("✅ 刪除成功！");
      // 如果剛好在編輯這筆，順便清掉
      if (editingId === p._id) resetForm();
      loadProducts();
    } catch {
      setMsg("❌ 刪除失敗");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="brand">🧰 管理後台</div>
          <div className="subtitle">新增 / 編輯 / 刪除商品（CRUD 完整版）</div>
        </div>

        <div className="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋商品…" />
          <span className="pill">{filtered.length} items</span>
          <Link className="pill" to="/">商品展示</Link>
        </div>
      </header>

      <section className="panel">
        <div className="panelTitle">{editingId ? "編輯商品" : "新增商品"}</div>

        <form className="form" onSubmit={submit}>
          <div className="field">
            <label>商品名稱</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="例如：Logitech 滑鼠"
            />
          </div>

          <div className="field">
            <label>價格 (NT$)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="例如：990"
            />
          </div>

          <div className="field wide">
            <label>圖片 URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="例如：https://via.placeholder.com/600x400"
            />
          </div>

          <button className="btn" type="submit">
            {editingId ? "💾 儲存更新" : "＋ 新增"}
          </button>
        </form>

        {editingId ? (
          <div style={{ marginTop: 12 }}>
            <button className="pill" onClick={resetForm}>取消編輯</button>
          </div>
        ) : null}

        {msg && <div className="message">{msg}</div>}
      </section>

      <section className="gridWrap">
        <div className="gridTitle">
          商品列表 {loading ? <span className="muted">載入中…</span> : null}
        </div>

        <div className="grid">
          {filtered.map((p) => (
            <div className="card" key={p._id}>
              <div className="thumb">
                <img src={p.imageUrl} alt={p.name} />
              </div>

              <div className="cardBody">
                <div className="name">{p.name}</div>
                <div className="price">NT$ {p.price}</div>
                <div className="meta">ID: {p._id}</div>

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="pill" onClick={() => onEdit(p)}>✏️ 編輯</button>
                  <button className="pill" onClick={() => onDelete(p)}>🗑️ 刪除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
