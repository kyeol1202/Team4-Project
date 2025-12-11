import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://http://192.168.0.224:5173";
const API_URL = "http://192.168.0.224:8080";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

  const toggleSelect = (pid) =>
    setSelected((prev) =>
      prev.includes(pid)
        ? prev.filter((i) => i !== pid)
        : [...prev, pid]
    );

  const refreshCart = async () => {
    const userId = localStorage.getItem("member_id");
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();

      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✔ 체크박스 선택/해제
  const toggleSelect = (pid) =>
    setSelected((prev) =>
      prev.includes(pid)
        ? prev.filter((i) => i !== pid)
        : [...prev, pid]
    );

  // ✔ 수량 변경
  const updateQty = async (pid, newQty) => {
    const userId = localStorage.getItem("member_id");

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: pid,
        quantity: newQty,
      }),
    });

    refreshCart();
  };

  // ✔ 삭제
  const removeItem = async (item) => {
    const userId = localStorage.getItem("member_id");

    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: item.product_id,
      }),
    });

    refreshCart();
  };

  const total = useMemo(
    () =>
      cart
        .filter((i) => selected.includes(i.product_id))
        .reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart, selected]
  );
  // ✔ 총 금액 계산
  const total = useMemo(() => {
    return cart
      .filter((i) => selected.includes(i.product_id))
      .reduce((sum, i) => sum + i.price * i.qty, 0);
  }, [cart, selected]);

  useEffect(() => {
    refreshCart();
  }, []);

  // ✔ 결제 페이지 이동
  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");

    const userId = localStorage.getItem("member_id");
    if (!userId) return alert("로그인이 필요합니다.");

    const selectedItems = cart.filter((i) =>
      selected.includes(i.product_id)
    );

    navigate("/payment", {
      state: {
        items: selectedItems,
        total,
        user_id: userId,
      },
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>장바구니</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setSelected(cart.map((i) => i.product_id))}>
          전체 선택
        </button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      {cart.map((item) => (
        <div key={item.product_id} className="product-item">
          <input type="checkbox" checked={selected.includes(item.product_id)} onChange={() => toggleSelect(item.product_id)} />

          <div className="product-info">
            <span className="product-name">{item.name}</span>
            <span className="product-price">{item.price.toLocaleString()}원</span>
        <div
          key={item.product_id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {/* 체크박스 */}
          <input
            type="checkbox"
            checked={selected.includes(item.product_id)}
            onChange={() => toggleSelect(item.product_id)}
          />

          {/* 상품 정보 */}
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>

          <div className="qty-control">
            <button onClick={() => updateQty(item.product_id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
          {/* 수량 조절 */}
          <div>
            <button
              onClick={() =>
                updateQty(item.product_id, item.qty - 1)
              }
              disabled={item.qty <= 1}
            >
              -
            </button>
            <span style={{ margin: "0 8px" }}>{item.qty}</span>
            <button
              onClick={() =>
                updateQty(item.product_id, item.qty + 1)
              }
            >
              +
            </button>
          </div>

          {/* 삭제 */}
          <button onClick={() => removeItem(item)}>삭제</button>
        </div>
      ))}

      <div className="total-price">총 {total.toLocaleString()}원</div>
      {/* 총 금액 */}
      <h2>선택 총 금액: {total.toLocaleString()}원</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
        <button onClick={handleCheckout}>선택 상품 결제하기</button>
      </div>
    </div>
  );
}
