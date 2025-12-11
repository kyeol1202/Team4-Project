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

  // 회원 정보 없으면 장바구니로 이동
  useEffect(() => {
    if (!user_id) {
      alert("회원 정보가 없습니다.");
      navigate("/cart");
    }
  }, [user_id, navigate]);

  // 회원 정보와 동일 체크 시 정보 자동 입력
  useEffect(() => {
    setPaymentInfo((prev) =>
      sameAsUser
        ? { ...userInfo, paymentMethod: prev.paymentMethod }
        : { ...prev, name: "", phone: "", email: "", address: "", detailAddress: "" }
    );
  }, [sameAsUser]);

  // 결제 처리
  const handlePayment = async () => {
    if (!paymentInfo.paymentMethod) return alert("결제 수단을 선택해주세요.");
    if (selectedProducts.length === 0) return alert("선택된 상품이 없습니다.");
    if (!user_id) return alert("회원 정보가 없습니다.");

    try {
      // 현금 결제는 별도 처리
      if (paymentInfo.paymentMethod === "cash") {
        const resCash = await fetch(`${API_URL}/api/order/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, items: selectedProducts, total }),
        });

        if (!resCash.ok) {
          const text = await resCash.text();
          throw new Error(`현금 결제 API 오류: ${resCash.status} ${text}`);
        }

        let dataCash;
        try {
          dataCash = await resCash.json();
        } catch (err) {
          throw new Error("현금 결제 응답 JSON 파싱 실패: " + err.message);
        }

        alert(
          `현금 결제 안내\n총 금액: ${total.toLocaleString()}원\n주문번호: ${dataCash.orderId}`
        );
        navigate("/complete");
        return;
      }

      // 카드/카카오/네이버 결제
      let apiUrl = "";
      switch (paymentInfo.paymentMethod) {
        case "kakao":
          apiUrl = `${API_URL}/api/kakao-pay/ready`;
          break;
        case "naver":
          apiUrl = `${API_URL}/api/naver-pay/ready`;
          break;
        case "card":
          apiUrl = `${API_URL}/api/card-pay/ready`;
          break;
        default:
          return;
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedProducts, total, user_id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`결제 준비 API 오류: ${res.status} ${text}`);
      }

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
    <div className="p-5 max-w-600 mx-auto">
      <h2 className="text-xl font-bold mb-4">결제 페이지</h2>

      {/* 선택 상품 */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">선택된 상품</h3>
        {selectedProducts.length === 0 && <p>선택된 상품이 없습니다.</p>}
        {selectedProducts.map((item) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>
              {item.name} ({item.qty}개)
            </span>
            <span>{(item.price * item.qty).toLocaleString()}원</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="text-right font-bold">총 {total.toLocaleString()}원</div>
      </div>

      {/* 배송지 */}
      <div className="border p-4 rounded mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={sameAsUser}
            onChange={() => setSameAsUser(!sameAsUser)}
          />
          회원정보와 동일
        </div>
        {["name", "phone", "email", "address", "detailAddress"].map((key) => (
          <input
            key={key}
            className="border w-full p-2 mb-2"
            placeholder={key}
            value={paymentInfo[key]}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, [key]: e.target.value })}
            disabled={sameAsUser}
          />
        ))}
      </div>

      {/* 결제 수단 */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">결제 수단</h3>
        <select
          className="border w-full p-2"
          value={paymentInfo.paymentMethod}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
        >
          <option value="">선택</option>
          <option value="kakao">카카오페이</option>
          <option value="naver">네이버페이</option>
          <option value="card">카드 결제</option>
          <option value="cash">현금 결제</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-black text-white py-3 rounded"
      >
        결제하기
      </button>
      <button
        onClick={() => navigate("/")}
        className="w-full border mt-3 py-3 rounded"
      >
        계속 쇼핑하기
      </button>
    </div>
  );
}

export default Payment;
