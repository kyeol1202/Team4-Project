import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: selectedProducts = [], total = 0, user_id = null } =
    location.state || {};

  const [sameAsUser, setSameAsUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    detailAddress: "",
    paymentMethod: "",
  });

  // 회원 정보 불러오기
  useEffect(() => {
    if (!user_id) {
      alert("회원 정보가 없습니다.");
      navigate("/cart");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/${user_id}`);
        const data = await res.json();

        if (data.success) {
          setUserInfo(data.user);
        }
      } catch {
        console.warn("회원정보 API 실패 → 미사용");
      }
    })();
  }, [user_id]);

  // 회원정보 동일 체크
  useEffect(() => {
    if (sameAsUser && userInfo) {
      setPaymentInfo((prev) => ({
        ...prev,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
      }));
    }
  }, [sameAsUser, userInfo]);

  const handlePayment = async () => {
    // 결제 수단 체크
    if (!paymentInfo.paymentMethod) {
      return alert("결제 수단을 선택해주세요.");
    }

    // 주소 필수 체크
    if (!paymentInfo.address || paymentInfo.address.trim() === "") {
      return alert("배송 주소를 반드시 입력해주세요.");
    }

    if (!paymentInfo.detailAddress || paymentInfo.detailAddress.trim() === "") {
      return alert("상세 주소를 반드시 입력해주세요.");
    }

    try {
      const res = await fetch(`${API_URL}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          items: selectedProducts,
          total,
          delivery: {
            name: paymentInfo.name,
            phone: paymentInfo.phone,
            email: paymentInfo.email,
            address: paymentInfo.address,
            detail: paymentInfo.detailAddress,
          },
          paymentMethod: paymentInfo.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!data.success) return alert("주문 저장 실패");

      navigate(`/payment-success?order_id=${data.order_id}`);
    } catch (err) {
      console.error("order error", err);
      alert("결제를 진행할 수 없습니다.");
    }
  };

  return (
    <div className="payment-container">
      <h1>결제 페이지</h1>

      {/* 상품 리스트 */}
      <div className="form-section">
        <h2>주문 상품</h2>
        {selectedProducts.map((item) => (
          <div key={item.product_id}>
            {item.name} ({item.qty}) — {(item.price * item.qty).toLocaleString()}원
          </div>
        ))}
        <strong>총 금액: {total.toLocaleString()}원</strong>
      </div>

      {/* 배송지 */}
      <div className="form-section">
        <h2>배송지</h2>

        <label>
          <input
            type="checkbox"
            checked={sameAsUser}
            onChange={() => setSameAsUser(!sameAsUser)}
          />
          회원 정보와 동일
        </label>

        {["name", "phone", "email", "address", "detailAddress"].map((key) => (
          <input
            key={key}
            placeholder={key}
            value={paymentInfo[key]}
            disabled={sameAsUser && (key !== "paymentMethod")}
            onChange={(event) =>
              setPaymentInfo({ ...paymentInfo, [key]: event.target.value })
            }
          />
        ))}
      </div>

      {/* 결제 수단 */}
      <div className="form-section">
        <h2>결제 수단</h2>
        <select
          value={paymentInfo.paymentMethod}
          onChange={(event) =>
            setPaymentInfo({ ...paymentInfo, paymentMethod: event.target.value })
          }
        >
          <option value="">선택</option>
          <option value="kakao">카카오페이</option>
          <option value="naver">네이버페이</option>
          <option value="card">카드 결제</option>
          <option value="cash">현금 결제</option>
        </select>
      </div>

      <button onClick={() => navigate("/cart")}>장바구니로</button>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
