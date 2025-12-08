import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Payment() {
  const navigate = useNavigate();
  const { cart } = useCart();

  // 회원정보 (백엔드/DB 연동 시 useEffect로 가져오기)
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

  // 회원정보와 동일 체크하면 자동 입력
  useEffect(() => {
    if (sameAsUser) {
      setPaymentInfo({
        ...paymentInfo,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        address: userInfo.address,
        detailAddress: userInfo.detailAddress,
      });
    } else {
      setPaymentInfo({
        ...paymentInfo,
        name: "",
        phone: "",
        email: "",
        address: "",
        detailAddress: "",
      });
    }
  }, [sameAsUser]);

  // 선택상품 합계
  const selectedProducts = cart.filter(item => item.selected === true);
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    alert("결제 완료!");
    navigate("/complete");
  };

  return (
    <div className="p-5 max-w-600 mx-auto">
      <h2 className="text-xl font-bold mb-4">결제 페이지</h2>

      {/* 선택상품 리스트 */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">선택된 상품</h3>
        {selectedProducts.map((item) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>{item.name} ({item.quantity}개)</span>
            <span>{(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
        <hr className="my-2"/>
        <div className="text-right font-bold">
          총 {totalPrice.toLocaleString()}원
        </div>
      </div>

      {/* 배송지 정보 */}
      <div className="border p-4 rounded mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={sameAsUser}
            onChange={() => setSameAsUser(!sameAsUser)}
          />
          <span>회원정보와 동일</span>
        </div>

        <input
          className="border w-full p-2 mb-2"
          placeholder="이름"
          value={paymentInfo.name}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
          disabled={sameAsUser}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="연락처"
          value={paymentInfo.phone}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, phone: e.target.value })}
          disabled={sameAsUser}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="이메일"
          value={paymentInfo.email}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, email: e.target.value })}
          disabled={sameAsUser}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="도로명 주소"
          value={paymentInfo.address}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, address: e.target.value })}
          disabled={sameAsUser}
        />
        <input
          className="border w-full p-2 mb-2"
          placeholder="상세 주소"
          value={paymentInfo.detailAddress}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, detailAddress: e.target.value })}
          disabled={sameAsUser}
        />
      </div>

      {/* 결제 수단 */}
      <div className="border p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">결제 수단</h3>
        <select
          className="border w-full p-2"
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
        onClick={handleOrder}
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
