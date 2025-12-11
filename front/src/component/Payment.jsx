import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:8080";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: selectedProducts = [], total = 0, user_id = null } = location.state || {};

  const userInfo = {
    name: "홍길동",
    phone: "010-1234-5678",
    email: "user@email.com",
    address: "서울시 강남구 테헤란로 00",
    detailAddress: "101동 202호",
  };

  const [sameAsUser, setSameAsUser] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (!user_id) {
      alert("회원 정보가 없습니다.");
      navigate("/cart");
    }
  }, [user_id, navigate]);

  useEffect(() => {
    setPaymentInfo(prev =>
      sameAsUser
        ? { ...userInfo, paymentMethod: prev.paymentMethod }
        : { ...prev, name: "", phone: "", email: "", address: "", detailAddress: "" }
    );
  }, [sameAsUser]);

  const handlePayment = async () => {
    if (!paymentInfo.paymentMethod) return alert("결제 수단을 선택해주세요.");
    if (selectedProducts.length === 0) return alert("선택된 상품이 없습니다.");
    if (!user_id) return alert("회원 정보가 없습니다.");

    try {
      // 현금 결제
      if (paymentInfo.paymentMethod === "cash") {
        const resCash = await fetch(`${API_URL}/api/order/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, items: selectedProducts, total }),
        });

        if (!resCash.ok) throw new Error("현금 결제 API 오류");

        const dataCash = await resCash.json();
        alert(`현금 결제 안내\n총 금액: ${total.toLocaleString()}원\n주문번호: ${dataCash.orderId}`);
        navigate("/complete");
        return;
      }

      // 카드/카카오/네이버 결제
      let apiUrl = "";
      switch (paymentInfo.paymentMethod) {
        case "kakao": apiUrl = `${API_URL}/api/kakao-pay/ready`; break;
        case "naver": apiUrl = `${API_URL}/api/naver-pay/ready`; break;
        case "card": apiUrl = `${API_URL}/api/card-pay/ready`; break;
        default: return;
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedProducts, total, user_id }),
      });

      if (!res.ok) throw new Error("결제 준비 API 오류");

      const data = await res.json();
      if (data.next_redirect_pc_url || data.next_redirect_mobile_url) {
        window.location.href = data.next_redirect_pc_url || data.next_redirect_mobile_url;
      } else {
        alert("결제 완료");
        navigate("/complete");
      }
    } catch (err) {
      console.error(err);
      alert("결제 실패: " + err.message);
    }
  };

  return (
    <div className="page-container">
      <h1>결제 페이지</h1>

      <div className="form-section">
        <h2>선택된 상품</h2>
        {selectedProducts.length === 0 && <p>선택된 상품이 없습니다.</p>}
        {selectedProducts.map(item => (
          <div key={item.id} className="product-item">
            <div className="product-info">
              <span className="product-name">{item.name} ({item.qty}개)</span>
              <span className="product-price">{(item.price * item.qty).toLocaleString()}원</span>
            </div>
          </div>
        ))}
        <div className="total-price">총 금액: {total.toLocaleString()}원</div>
      </div>

      <div className="form-section">
        <label className="same-user">
          <input type="checkbox" checked={sameAsUser} onChange={() => setSameAsUser(!sameAsUser)} />
          회원 정보와 동일
        </label>

        {["name", "phone", "email", "address", "detailAddress"].map(key => (
          <input
            key={key}
            placeholder={key}
            value={paymentInfo[key]}
            onChange={e => setPaymentInfo({ ...paymentInfo, [key]: e.target.value })}
            disabled={sameAsUser}
          />
        ))}
      </div>

      <div className="form-section">
        <label>결제 수단</label>
        <select
          value={paymentInfo.paymentMethod}
          onChange={e => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
        >
          <option value="">선택</option>
          <option value="kakao">카카오페이</option>
          <option value="naver">네이버페이</option>
          <option value="card">카드 결제</option>
          <option value="cash">현금 결제</option>
        </select>
      </div>

      <div className="action-btns">
        <button className="btn-pay" onClick={handlePayment}>결제하기</button>
        <button className="btn-cancel" onClick={() => navigate("/")}>계속 쇼핑하기</button>
      </div>
    </div>
  );
}

export default Payment;
