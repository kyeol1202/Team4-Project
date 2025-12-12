// src/component/PaymentSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Payment.jsx에서 state로 받은 주문번호
  const orderId = location.state?.orderId || null;

  if (!orderId) {
    return (
      <div className="pay-success-wrapper">
        <div className="pay-success-card">
          <h2 className="pay-success-title">잘못된 접근입니다</h2>
          <button
            className="pay-success-btn dark"
            onClick={() => navigate("/")}
          >
            홈으로 이동
          </button>
        </div>

        {/* 컴포넌트 전용 스타일 */}
        <style>{successStyle}</style>
      </div>
    );
  }

  return (
    <div className="pay-success-wrapper">
      <div className="pay-success-card">
        <div className="pay-success-icon">✓</div>

        <h2 className="pay-success-title">결제가 완료되었습니다</h2>
        <p className="pay-success-desc">
          주문이 정상적으로 접수되었습니다.
        </p>

        <div className="pay-success-order">
          <span>주문 번호</span>
          <strong>{orderId}</strong>
        </div>

        <div className="pay-success-actions">
          <button
            className="pay-success-btn outline"
            onClick={() => navigate("/mypage")}
          >
            마이페이지
          </button>
          <button
            className="pay-success-btn dark"
            onClick={() => navigate("/")}
          >
            홈으로
          </button>
        </div>
      </div>

      {/* 컴포넌트 전용 스타일 */}
      <style>{successStyle}</style>
    </div>
  );
}

/* ===============================
   PaymentSuccess 전용 스타일
================================ */
const successStyle = `
.pay-success-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  font-family: 'Cormorant', serif;
}

.pay-success-card {
  width: 100%;
  max-width: 520px;
  padding: 48px 36px;
  background: #ffffff;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 14px 35px rgba(0,0,0,0.1);
  animation: fadeUp 0.4s ease;
}

.pay-success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-success-title {
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111;
}

.pay-success-desc {
  font-size: 16px;
  color: #555;
  margin-bottom: 28px;
}

.pay-success-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px dashed #ccc;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 32px;
  font-size: 15px;
}

.pay-success-actions {
  display: flex;
  gap: 12px;
}

.pay-success-btn {
  flex: 1;
  padding: 14px 0;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pay-success-btn.dark {
  background: #000;
  color: #fff;
  border: none;
}

.pay-success-btn.dark:hover {
  background: #222;
}

.pay-success-btn.outline {
  background: #fff;
  color: #111;
  border: 1px solid #ccc;
}

.pay-success-btn.outline:hover {
  background: #f5f5f5;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
