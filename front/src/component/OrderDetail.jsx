import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const foundOrder = storedOrders.find((o) => o.id === orderId);

    if (!foundOrder) {
      alert("주문을 찾을 수 없습니다.");
      navigate("/mypage");
    } else {
      setOrder(foundOrder);
    }
  }, [orderId, navigate]);

  if (!order) return <div style={{ padding: "40px" }}>로딩중...</div>;

  const handleReturn = (productId, type) => {
    if (!window.confirm(`${type} 신청을 진행하시겠습니까?`)) return;

    const updatedItems = order.items.map((item) =>
      item.productId === productId ? { ...item, returnStatus: `${type}신청중` } : item
    );

    const updatedOrder = { ...order, items: updatedItems };
    setOrder(updatedOrder);

    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = storedOrders.map((o) => (o.id === order.id ? updatedOrder : o));
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>주문 상세 내역</h2>
      <p>
        <strong>주문번호:</strong> {order.id} <br />
        <strong>주문일:</strong> {order.date} <br />
        <strong>총 금액:</strong> {order.total.toLocaleString()}원<br />
        <strong>배송 상태:</strong>{" "}
        <span
          style={{
            color: order.status === "배송완료" ? "green" : order.status === "배송중" ? "orange" : "gray",
            fontWeight: "bold",
          }}
        >
          {order.status}
        </span>
      </p>

      <h3>상품 목록</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
        {order.items.map((item) => (
          <div
            key={item.productId}
            style={{
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={item.image}
              alt={item.productName}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
            />
            <p style={{ marginTop: "8px", fontWeight: "bold" }}>{item.productName}</p>
            <p>수량: {item.quantity}</p>
            <p>가격: {item.price.toLocaleString()}원</p>
            <p>
              <strong>교환/반품:</strong>{" "}
              <span
                style={{
                  color:
                    item.returnStatus === "교환신청중"
                      ? "blue"
                      : item.returnStatus === "반품신청중"
                      ? "red"
                      : "gray",
                  fontWeight: "bold",
                }}
              >
                {item.returnStatus || "없음"}
              </span>
            </p>

            {(item.returnStatus === "없음" || !item.returnStatus) && (
              <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginTop: "5px" }}>
                <button onClick={() => handleReturn(item.productId, "교환")}>교환 신청</button>
                <button onClick={() => handleReturn(item.productId, "반품")}>반품 신청</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/mypage")} style={{ marginRight: "10px" }}>
          마이페이지로
        </button>
        <button onClick={() => navigate("/")}>메인으로</button>
      </div>
    </div>
  );
}

export default OrderDetail;

