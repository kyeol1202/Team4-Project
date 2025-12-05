import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <h1>장바구니</h1>
      {cart.length === 0 && <p>장바구니가 비어 있습니다.</p>}

      {cart.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price}원</p>

          <input
            type="number"
            value={item.qty}
            min="1"
            onChange={e => updateQty(item.id, parseInt(e.target.value))}
          />

          <button onClick={() => removeFromCart(item.id)}>삭제</button>
        </div>
      ))}

      <h2>총 금액: {total.toLocaleString()}원</h2>
      <button disabled={!cart.length}>결제하기</button>
    </div>
  );
}

export default Cart;
