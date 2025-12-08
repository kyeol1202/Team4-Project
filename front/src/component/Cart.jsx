import { useCart } from "../context/CartContext";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const total = useMemo(
    () => cart
      .filter(item => selected.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart, selected]
  );

  const handleCheckout = () => {
    if (!selected.length) return alert("구매할 상품을 선택하세요.");
    const selectedItems = cart.filter(item => selected.includes(item.id));
    navigate("/payment", { state: { items: selectedItems, total } });
  };

  return (
    <div className="p-5 max-w-600 mx-auto">
      <h1 className="text-xl font-bold mb-4">장바구니</h1>

      {cart.length === 0 && <p>장바구니가 비어 있습니다.</p>}

      <div className="mb-3">
        <button className="mr-2" onClick={() => setSelected(cart.map(item => item.id))}>전체 선택</button>
        <button onClick={() => setSelected([])}>전체 해제</button>
      </div>

      {cart.map(item => (
        <div key={item.id} className="flex items-center gap-4 border p-3 mb-2">
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
          />
          <div className="flex-1">
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)}>삭제</button>
        </div>
      ))}

      <h2 className="font-bold mt-4">선택 총 금액: {total.toLocaleString()}원</h2>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 border py-2 rounded" onClick={() => navigate("/main")}>계속 쇼핑하기</button>
        <button
          className="flex-1 bg-black text-white py-2 rounded"
          onClick={handleCheckout}
          disabled={selected.length === 0}
        >
          선택 상품 결제하기
        </button>
      </div>
    </div>
  );
}

export default Cart;




