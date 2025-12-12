import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "결제 처리 중 문제가 발생했습니다.";

  return (
    <div className="payfail-wrapper">
      <div className="payfail-card">
        <h1 className="payfail-title">결제 실패</h1>
        <p className="payfail-message">{message}</p>

        <div className="payfail-actions">
          <button className="payfail-btn dark" onClick={() => navigate("/cart")}>
            장바구니로
          </button>
          <button className="payfail-btn outline" onClick={() => navigate("/")}>
            홈으로
          </button>
        </div>
      </div>

      {/* 👇 이 컴포넌트 전용 스타일 */}
      <style>
        {`
          .payfail-wrapper {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fafafa;
            font-family: 'Cormorant', serif;
          }

          .payfail-card {
            width: 100%;
            max-width: 520px;
            padding: 44px 36px;
            background: #ffffff;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          .payfail-title {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #111;
          }

          .payfail-message {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 32px;
          }

          .payfail-actions {
            display: flex;
            gap: 12px;
          }

          .payfail-btn {
            flex: 1;
            padding: 14px 0;
            font-size: 15px;
            font-weight: 500;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .payfail-btn.dark {
            background: #000;
            color: #fff;
            border: none;
          }

          .payfail-btn.dark:hover {
            background: #222;
          }

          .payfail-btn.outline {
            background: #fff;
            color: #111;
            border: 1px solid #ccc;
          }

          .payfail-btn.outline:hover {
            background: #f5f5f5;
          }
        `}
      </style>
    </div>
  );
}


