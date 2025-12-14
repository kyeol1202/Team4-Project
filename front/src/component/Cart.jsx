import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const API_URL = "http://192.168.0.224:8080";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

  const toggleSelect = (pid) =>
    setSelected((prev) =>
      prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]
    );

  const refreshCart = async () => {
    const userId = localStorage.getItem("member_id");
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error("장바구니 불러오기 오류:", err);
    }
  };

  const updateQty = async (pid, newQty) => {
    if (newQty < 1) return;
    const userId = localStorage.getItem("member_id");

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, product_id: pid, quantity: newQty }),
    });

    refreshCart();
  };

  const removeItem = async (item) => {
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
        .filter((i) => selected.includes(i.product_id))
        .reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart, selected]
  );

  useEffect(() => {
    refreshCart();
  }, []);

  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");
    const userId = localStorage.getItem("member_id");
    if (!userId) return alert("로그인이 필요합니다.");

    navigate("/payment", {
      state: { items: cart.filter((i) => selected.includes(i.product_id)), total, user_id: userId },
    });
  };

  return (
    <div className="cart-container">
      <h1>장바구니</h1>

      <div className="cart-select-all">
        <button onClick={() => setSelected(cart.map((i) => i.product_id))}>전체 선택</button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.product_id} className="cart-item">
            <input
              type="checkbox"
              checked={selected.includes(item.product_id)}
              onChange={() => toggleSelect(item.product_id)}
            />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.price.toLocaleString()}원</p>
            </div>
            <div className="cart-item-qty">
              <button onClick={() => updateQty(item.product_id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
            </div>
            <button className="cart-item-remove" onClick={() => removeItem(item)}>삭제</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>선택 총 금액: {total.toLocaleString()}원</h2>
        <div className="cart-actions">
          <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
          <button onClick={handleCheckout}>선택 상품 결제하기</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
