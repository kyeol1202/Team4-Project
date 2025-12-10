import { useCart } from "../context/CartContext";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const total = useMemo(
    () =>
      cart
        .filter(item => selected.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart, selected]
  );

  const handleCheckout = async () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");

    const selectedItems = cart.filter(item => selected.includes(item.id));

    try {
      // 백엔드 카카오페이 준비 API 호출
      const res = await fetch("http://localhost:4000/api/kakao-pay/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems, total }),
      });

      const data = await res.json();
      if (data && data.next_redirect_pc_url) {
        window.location.href = data.next_redirect_pc_url; // 카카오페이 결제 페이지로 이동
      } else {
        alert("결제 준비에 실패했습니다.");
        console.log(data);
      }
    } catch (err) {
      console.error(err);
      alert("결제 서버 오류");
    }
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
            <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span style={{ margin: "0 8px" }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)}>삭제</button>
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






