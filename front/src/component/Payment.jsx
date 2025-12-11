import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: selectedProducts, total } = location.state || { items: [], total: 0 };

  const userInfo = {
    name: "저장된 회원명",
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
    if (sameAsUser) {
      setPaymentInfo(prev => ({
        ...prev,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
      }));
    } else {
      setPaymentInfo(prev => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        address: "",
        detailAddress: "",
      }));
    }
  }, [sameAsUser]);

  const handlePayment = async () => {
    if (!paymentInfo.paymentMethod) return alert("결제 수단을 선택해주세요.");
    if (selectedProducts.length === 0) return alert("선택된 상품이 없습니다.");

    try {
      let apiUrl = "";

      switch (paymentInfo.paymentMethod) {
        case "kakao":
          apiUrl = "/api/kakao-pay/ready";
          break;
        case "naver":
          apiUrl = "/api/naver-pay/ready";
          break;
        case "card":
          apiUrl = "/api/card-pay/ready";
          break;
        case "cash":
          // ✅ 현금 결제 안내
          alert(`현금 결제 안내:\n
               은행: 국민은행
               계좌번호: 123-456-7890
               예금주: 홍길동
               총 결제금액: ${total.toLocaleString()}원
               입금 확인 후 배송이 진행됩니다.`);
          navigate("/complete");
          return;
        default:
          return;
      }

      // 서버 결제 준비 API 호출
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedProducts, total }),
      });

      const data = await res.json();

      if (data.next_redirect_pc_url || data.next_redirect_mobile_url) {
        window.location.href = data.next_redirect_pc_url || data.next_redirect_mobile_url;
      } else {
        alert(`${paymentInfo.paymentMethod} 결제 완료!`);
        navigate("/complete");
      }

    } catch (err) {
      console.error(err);
      alert("결제 준비에 실패했습니다.");
    }
  };

  return (
    <div className="p-5 max-w-600 mx-auto">
      <h2 className="text-xl font-bold mb-4">결제 페이지</h2>

      {/* 선택 상품 */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">선택된 상품</h3>
        {selectedProducts.length === 0 && <p>선택된 상품이 없습니다.</p>}
        {selectedProducts.map(item => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>{item.name} ({item.qty}개)</span>
            <span>{(item.price * item.qty).toLocaleString()}원</span>
          </div>
        ))}
        <hr className="my-2"/>
        <div className="text-right font-bold">
          총 {total.toLocaleString()}원
        </div>
      </div>

      {/* 배송지 */}
      <div className="border p-4 rounded mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={sameAsUser} onChange={() => setSameAsUser(!sameAsUser)} />
          <span>회원정보와 동일</span>
        </div>

        {["name", "phone", "email", "address", "detailAddress"].map(key => (
          <input
            key={key}
            className="border w-full p-2 mb-2"
            placeholder={key}
            value={paymentInfo[key]}
            onChange={e => setPaymentInfo({ ...paymentInfo, [key]: e.target.value })}
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
          onChange={e => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
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

