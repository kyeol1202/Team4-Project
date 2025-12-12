// src/component/Cart.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("member_id");
  const [cart, setCart] = useState([]);

  const refreshCart = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/cart/${userId}`);
      const data = await res.json();

      if (data.success) setCart(data.data);
      else setCart([]);
    } catch (err) {
      console.error("카트 API 오류", err);
      setCart([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // ✅ 결제 성공 후 돌아왔을 때 장바구니 새로고침
  useEffect(() => {
    if (location.state?.fromPaymentSuccess) {
      refreshCart();
    }
  }, [location]);

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;

    await fetch(`${API_URL}/api/cart/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity: newQty,
      }),
    });

    refreshCart();
  };

  const deleteItem = async (productId) => {
    await fetch(`${API_URL}/api/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
      }),
    });

    refreshCart();
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const goPayment = () => {
    if (cart.length === 0) return alert("선택한 상품이 없습니다.");

    navigate("/payment", {
      state: {
        items: cart,
        total: totalPrice,
        
      },
    });
  };

   return (
  <div className="cart-container">
    <h1 className="cart-title">장바구니</h1>

    {cart.length === 0 ? (
      <div className="cart-empty">
        <p>장바구니가 비어 있습니다.</p>
        <button onClick={() => navigate("/")}>쇼핑하러 가기</button>
      </div>
    ) : (
      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.product_id}>
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>{item.price.toLocaleString()}원</p>
            </div>

            <div className="cart-item-qty">
              <button onClick={() => updateQty(item.product_id, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
            </div>

            <div className="cart-item-total">
              {(item.price * item.qty).toLocaleString()}원
            </div>

            <button
              className="cart-item-remove"
              onClick={() => deleteItem(item.product_id)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    )}

    {cart.length > 0 && (
      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>총 결제 금액</span>
          <strong>{totalPrice.toLocaleString()}원</strong>
        </div>

        <button className="cart-pay-btn" onClick={goPayment}>
          결제하기
        </button>
      </div>
    )}
  </div>
);
}
