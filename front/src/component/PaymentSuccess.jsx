// src/component/PaymentSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setOrderId(params.get("order_id"));
  }, [location]);

  return (
    <div className="success-container">
      <h2>결제가 완료되었습니다!</h2>
      {orderId ? <p>주문 번호: {orderId}</p> : <p>주문 번호 없음</p>}

      <button onClick={() => navigate("/mypage")}>마이페이지</button>
      <button onClick={() => navigate("/")}>홈</button>
    </div>
  );
}
