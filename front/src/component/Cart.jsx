import { useCart } from "../context/CartContext";
import { useMemo } from "react";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const handleQtyChange = (id, value) => {
    const qty = Math.max(1, Number(value) || 1); // 최소 1, NaN 방지
    updateQty(id, qty);
  };

  return (
    <div>
      <h1>장바구니</h1>
      {cart.length === 0 && <p>장바구니가 비어 있습니다.</p>}

      {cart.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price.toLocaleString()}원</p>

          <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>
            -
          </button>

          <input
            type="number"
            value={item.qty}
            min="1"
            onChange={e => handleQtyChange(item.id, e.target.value)}
            style={{ width: "50px", textAlign: "center" }}
          />

          <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>

          <button onClick={() => confirm("삭제할까요?") && removeFromCart(item.id)}>
            삭제
          </button>
        </div>
      ))}

      <h2>총 금액: {total.toLocaleString()}원</h2>
      <button disabled={!cart.length} onClick={() => alert("결제 페이지 이동!")}>
        결제하기
      </button>
    </div>
  );
}

export default Cart;

