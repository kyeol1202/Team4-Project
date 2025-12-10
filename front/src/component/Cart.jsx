import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);

 useEffect(() => {
  const userId = localStorage.getItem("member_id");
  if (!userId) return;

  fetch(`${API_URL}/api/cart/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const list = data.data.map(item => ({
          ...item,
          img: `${API_URL}${item.img}`,
        }));
        setCart(list);
      }
    });
}, []);


  const loadCart = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return navigate("/login");

    const res = await fetch(`${API_URL}/api/cart/${userId}`);
    const data = await res.json();

    if (data.success) {
      const result = data.data.map((item) => ({
        cart_id: item.cart_id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        img: `${API_URL}${item.img}`,
      }));
      setCart(result);
    }
  };

  const toggleSelect = (cart_id) => {
    setSelected((prev) =>
      prev.includes(cart_id)
        ? prev.filter((id) => id !== cart_id)
        : [...prev, cart_id]
    );
  };

  const total = useMemo(
    () =>
      cart
        .filter((item) => selected.includes(item.cart_id))
        .reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart, selected]
  );

  const updateQty = async (item, newQty) => {
    const userId = localStorage.getItem("user_id");

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: item.product_id,
        quantity: newQty,
      }),
    });

    loadCart();
  };

  const removeItem = async (item) => {
    const userId = localStorage.getItem("user_id");

    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: item.product_id,
      }),
    });

    loadCart();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>장바구니</h1>

      {cart.map((item) => (
        <div
          key={item.cart_id}
          style={{
            display: "flex",
            gap: 20,
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(item.cart_id)}
            onChange={() => toggleSelect(item.cart_id)}
          />

          <img src={item.img} width={80} height={80} />

          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>{item.price.toLocaleString()}원</p>
          </div>

          <div>
            <button
              onClick={() => updateQty(item, Math.max(1, item.qty - 1))}
              disabled={item.qty <= 1}
            >
              -
            </button>

            <span style={{ margin: "0 10px" }}>{item.qty}</span>

            <button onClick={() => updateQty(item, item.qty + 1)}>+</button>
          </div>

          <button onClick={() => removeItem(item)}>삭제</button>
        </div>
      ))}

      <h2>총 금액: {total.toLocaleString()}원</h2>
    </div>
  );
}

export default Cart;
