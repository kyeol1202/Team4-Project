// src/component/Payment.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Cart에서 전달된 데이터
  const { items = [], total = 0 } = location.state || {};
  const userId = localStorage.getItem("member_id");

  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  /* ------------------------------------------------
     ❗ 잘못된 접근 차단 (새로고침 / 직접 URL 접근)
  ------------------------------------------------ */
  useEffect(() => {
    if (!userId || items.length === 0) {
      alert("잘못된 접근입니다.");
      navigate("/cart");
    }
  }, [userId, items, navigate]);

  /* ------------------------------------------------
     결제 처리
  ------------------------------------------------ */
  const handlePayment = async () => {
    // 🔐 필수값 검증
    if (!paymentInfo.name || !paymentInfo.phone || !paymentInfo.address) {
      return alert("배송 정보를 모두 입력해주세요.");
    }

    if (!paymentInfo.paymentMethod) {
      return alert("결제 수단을 선택해주세요.");
    }

    try {
      const res = await fetch(`http://localhost:8080/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          items,
          total,
          delivery: {
            name: paymentInfo.name,
            phone: paymentInfo.phone,
            address: paymentInfo.address,
          },
          paymentMethod: paymentInfo.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return alert("결제 처리 중 오류가 발생했습니다.");
      }

      // ✅ 결제 성공 페이지 이동
      navigate("/payment-success", {
        state: { orderId: data.order_id },
      });

    } catch (err) {
      console.error("❌ 결제 오류:", err);
      alert("결제를 진행할 수 없습니다.");
    }
  };

  return (
    <div className="payment-container">
      <h1>결제 페이지</h1>

      {/* ---------------- 주문 상품 ---------------- */}
      <div className="form-section">
        <h2>주문 상품</h2>
       {items.map((item) => (
  <div key={item.product_id} style={{ marginBottom: 8 }}>
    <strong>{item.name}</strong> × {item.qty}
    <span style={{ float: "right" }}>
      {(item.price * item.qty).toLocaleString()}원
    </span>
  </div>
))}


        <strong>총 금액: {total.toLocaleString()}원</strong>
      </div>

      {/* ---------------- 배송지 ---------------- */}
      <div className="form-section">
        <h2>배송지 정보</h2>

        <input
          placeholder="받는 사람"
          value={paymentInfo.name}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, name: e.target.value })
          }
        />

        <input
          placeholder="연락처"
          value={paymentInfo.phone}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, phone: e.target.value })
          }
        />

        <input
          placeholder="배송 주소"
          value={paymentInfo.address}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, address: e.target.value })
          }
        />
      </div>

      {/* ---------------- 결제 수단 ---------------- */}
      <div className="form-section">
        <h2>결제 수단</h2>
        <select
          value={paymentInfo.paymentMethod}
          onChange={(e) =>
            setPaymentInfo({
              ...paymentInfo,
              paymentMethod: e.target.value,
            })
          }
        >
          <option value="">선택</option>
          <option value="kakaopay">카카오페이</option>
          <option value="naverpay">네이버페이</option>
          <option value="card">카드 결제</option>
          <option value="bank">무통장입금</option>
        </select>
      </div>

      <button onClick={() => navigate("/cart")}>장바구니로</button>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
