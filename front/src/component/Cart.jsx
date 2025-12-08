import { useCart } from "../context/CartContext";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const total = useMemo(() => cart.filter(item => selected.includes(item.id)).reduce((sum, item) => sum + item.price * item.qty, 0), [cart, selected]);

  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");
    const selectedItems = cart.filter(item => selected.includes(item.id));
    navigate("/payment", { state: { items: selectedItems, total } });
  };

  return (
    <div>
      <h1>장바구니</h1>
      {cart.length === 0 && <p>장바구니가 비어 있습니다.</p>}
      <button onClick={() => setSelected(cart.map(item => item.id))}>전체 선택</button>
      <button onClick={() => setSelected([])}>전체 해제</button>

      {cart.map(item => (
        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"10px", border:"1px solid #ddd", padding:"10px", margin:"10px 0" }}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
          <div style={{ flex:1 }}>
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>
          <div>
            <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)}>삭제</button>
        </div>
      ))}

      <h2>선택 총 금액: {total.toLocaleString()}원</h2>

      <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
      <button onClick={handleCheckout}>선택 상품 결제하기</button>
    </div>
  );
}

export default Cart;





