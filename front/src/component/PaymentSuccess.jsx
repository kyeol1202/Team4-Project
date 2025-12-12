import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://192.168.0.224:8080";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();   // ⭐ 반드시 필요함!
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setOrderId(params.get("order_id"));
  }, [location.search]);

  return (
    <div className="success-container">
      <h2>결제가 완료되었습니다!</h2>
      {orderId ? <p>주문 번호: {orderId}</p> : <p>주문 번호 없음</p>}

      <button onClick={() => navigate("/mypage")}>마이페이지</button>
      <button onClick={() => navigate("/")}>홈</button>
    </div>
  );
}

