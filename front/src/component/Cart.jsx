import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

  const toggleSelect = id => {
    setSelected(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const refreshCart = async () => {
    const userId = localStorage.getItem("member_id");
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error("카트 조회 에러:", err);
    }
  };

  const updateQty = async (id, newQty) => {
    const userId = localStorage.getItem("member_id");
    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: id, quantity: newQty }),
    });
    refreshCart();
  };

  const removeItem = async item => {
    const userId = localStorage.getItem("member_id");
    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: item.product_id }),
    });
    refreshCart();
  };

  const total = useMemo(
    () =>
      cart
        .filter(item => selected.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart, selected]
  );

  useEffect(() => {
    refreshCart();
  }, []);

  const handleCheckout = async () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");
    const selectedItems = cart.filter(item => selected.includes(item.id));
    const userId = localStorage.getItem("member_id");

    navigate("/payment", { state: { items: selectedItems, total, user_id: userId } });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>장바구니</h1>

      {cart.length === 0 && <p>장바구니가 비어 있습니다.</p>}

      <button onClick={() => setSelected(cart.map(item => item.id))}>전체 선택</button>
      <button onClick={() => setSelected([])}>전체 해제</button>

      {cart.map(item => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>
          <div>
            <button onClick={() => updateQty(item.product_id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span style={{ margin: "0 8px" }}>{item.qty}</span>
            <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
          </div>
          <button onClick={() => removeItem(item)}>삭제</button>
        </div>
      ))}

      <h2>선택 총 금액: {total.toLocaleString()}원</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
        <button onClick={handleCheckout}>선택 상품 결제하기</button>
      </div>
    </div>
  );
}

export default Cart;
