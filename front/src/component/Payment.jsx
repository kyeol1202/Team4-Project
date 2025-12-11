import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://http://192.168.0.224:5173";

export default function Payment() {
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
    setPaymentInfo((prev) =>
      sameAsUser
        ? { ...userInfo, paymentMethod: prev.paymentMethod }
        : { ...prev, name: "", phone: "", email: "", address: "", detailAddress: "" }
    );
  }, [sameAsUser]);

  const handlePayment = async () => {
    if (!paymentInfo.paymentMethod) return alert("결제 수단을 선택해주세요.");
    if (selectedProducts.length === 0) return alert("선택된 상품이 없습니다.");
    if (!user_id) return alert("회원 정보가 없습니다.");
    alert("결제 로직을 여기서 구현하세요.");
  };

  return (
    <div className="page-container">
      <h1>결제 페이지</h1>

      {/* 선택 상품 */}
      <div className="form-section">
        <h2>선택 상품</h2>
        {selectedProducts.length === 0 ? <p>선택된 상품이 없습니다.</p> :
          selectedProducts.map((item) => (
            <div key={item.product_id} className="product-item">
              <span>{item.name} ({item.qty}개)</span>
              <span>{(item.price * item.qty).toLocaleString()}원</span>
            </div>
          ))
        }
        <div className="total-price">총 {total.toLocaleString()}원</div>
      </div>

      {/* 배송지 */}
      <div className="form-section">
        <div className="same-user">
          <input type="checkbox" checked={sameAsUser} onChange={() => setSameAsUser(!sameAsUser)} />
          회원 정보와 동일
        </div>
        {["name","phone","email","address","detailAddress"].map((key) => (
          <input
            key={key}
            placeholder={key}
            value={paymentInfo[key]}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, [key]: e.target.value })}
            disabled={sameAsUser}
          />
        ))}
      </div>

      {/* 결제 수단 */}
      <div className="form-section">
        <h2>결제 수단</h2>
        <select value={paymentInfo.paymentMethod} onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}>
          <option value="">선택</option>
          <option value="kakao">카카오페이</option>
          <option value="naver">네이버페이</option>
          <option value="card">카드 결제</option>
          <option value="cash">현금 결제</option>
        </select>
      </div>

      <div className="action-btns">
        <button className="btn-cancel" onClick={() => navigate("/")}>계속 쇼핑하기</button>
        <button className="btn-pay" onClick={handlePayment}>결제하기</button>
      </div>
    </div>
  );
}

