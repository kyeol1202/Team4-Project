import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // URL 쿼리에서 order_id 가져오기
    const params = new URLSearchParams(location.search);
    setOrderId(params.get("order_id")); // 여기서 'order_id'로 정확히 맞춤
  }, [location]);

  return (
    <div className="p-5 max-w-600 mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">결제가 완료되었습니다!</h2>
      {orderId ? (
        <p>주문 번호: {orderId}</p>
      ) : (
        <p>주문 번호를 불러올 수 없습니다.</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        onClick={() => navigate("/")}
      >
        홈으로 이동
      </button>
    </div>
  );
}

export default PaymentSuccess;
