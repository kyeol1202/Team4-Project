import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://http://192.168.0.224:5173";

export default function Cart() {
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
      console.error(err);
    }
  };

  const updateQty = async (pid, newQty) => {
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

    const selectedItems = cart.filter((i) => selected.includes(i.product_id));
    navigate("/payment", { state: { items: selectedItems, total, user_id: userId } });
  };

  return (
    <div className="page-container">
      <h1>장바구니</h1>

      <div className="select-all">
        <button onClick={() => setSelected(cart.map((i) => i.product_id))}>전체 선택</button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      {cart.map((item) => (
        <div key={item.product_id} className="product-item">
          <input type="checkbox" checked={selected.includes(item.product_id)} onChange={() => toggleSelect(item.product_id)} />

          <div className="product-info">
            <span className="product-name">{item.name}</span>
            <span className="product-price">{item.price.toLocaleString()}원</span>
          </div>

          <div className="qty-control">
            <button onClick={() => updateQty(item.product_id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
          </div>

          <button className="remove-btn" onClick={() => removeItem(item)}>삭제</button>
        </div>
      ))}

      <div className="total-price">총 {total.toLocaleString()}원</div>

      <div className="action-btns">
        <button className="btn-cancel" onClick={() => navigate("/")}>계속 쇼핑하기</button>
        <button className="btn-pay" onClick={handleCheckout}>선택 상품 결제하기</button>
      </div>
    </div>
  );
}
