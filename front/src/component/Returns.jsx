import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./returns.css";

const API_URL = "http://192.168.0.224:8080";

function Returns() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const productId = params.get("productId");
  const type = params.get("type"); // 반품 | 교환

  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReturn = async () => {
    if (!email || !orderId) return alert("필수 정보를 확인해주세요.");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("member_id"),
          orderId,
          productId,
          type,
          email,
          reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`${type} 신청이 접수되었습니다.`);
        navigate("/mypage");
      } else {
        alert(data.message || "접수 실패");
      }
    } catch (err) {
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="returns-wrapper">
      <h1>AuRa Returns & Refunds</h1>

      <div className="returns-box">
        <h2>{type} 신청</h2>

        <label>
          이메일 주소
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          주문 번호
          <input type="text" value={orderId} disabled />
        </label>

        <label>
          사유 (선택)
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`${type} 사유를 입력해주세요`}
          />
        </label>

        <button onClick={submitReturn} disabled={loading}>
          {loading ? "접수 중..." : `${type} 신청`}
        </button>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 이전으로
        </button>
      </div>
    </div>
  );
}

export default Returns;
