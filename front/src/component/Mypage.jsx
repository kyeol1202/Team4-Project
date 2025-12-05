import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);

  // 🔹 현재 수정 중인 리뷰 ID와 임시 텍스트
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedOrders = localStorage.getItem("orders");
    const storedReviews = localStorage.getItem("reviews");

    if (!storedUser) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
      setOrders(JSON.parse(storedOrders) || []);
      setReviews(JSON.parse(storedReviews) || []);
    } catch {
      alert("세션 오류 발생. 다시 로그인하세요");
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const startEditing = (review) => {
    setEditingReviewId(review.id);
    setEditingText(review.content);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditingText("");
  };

  const saveEditing = () => {
    const updatedReviews = reviews.map((r) =>
      r.id === editingReviewId ? { ...r, content: editingText } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setEditingReviewId(null);
    setEditingText("");
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);
      setReviews(updatedReviews);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    }
  };

  const Logout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/", { replace: true });
  };

  if (loading) return <div style={{ padding: "40px" }}>로딩중...</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>마이페이지</h2>

      {/* 회원 정보 */}
      <h3
        style={{ cursor: "pointer", userSelect: "none", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenUserInfo(!openUserInfo)}
      >
        회원 정보 {openUserInfo ? "▲" : "▼"}
      </h3>
      {openUserInfo && (
        <p style={{ marginTop: "15px", lineHeight: "1.8" }}>
          <strong>이름:</strong> {user.name} <br />
          <strong>이메일:</strong> {user.email} <br />
          <strong>전화번호:</strong> {user.phone}
        </p>
      )}

      {/* 주문 내역 */}
      <h3
        style={{ cursor: "pointer", userSelect: "none", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenOrderList(!openOrderList)}
      >
        주문 내역 {openOrderList ? "▲" : "▼"}
      </h3>
      {openOrderList && (
        <>
          {orders.length === 0 ? (
            <p style={{ marginTop: "10px" }}>주문 내역이 없습니다.</p>
          ) : (
            <ul style={{ lineHeight: "2", marginTop: "10px" }}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  style={{ cursor: "pointer", borderBottom: "1px solid #ddd", padding: "10px 0" }}
                  onClick={() => handleOrderClick(order.id)}
                >
                  <strong>주문번호:</strong> {order.id} <br />
                  <strong>주문일:</strong> {order.date} <br />
                  <strong>총 금액:</strong> {order.total.toLocaleString()}원
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 내가 쓴 리뷰 */}
      <h3
        style={{ cursor: "pointer", userSelect: "none", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenReviewList(!openReviewList)}
      >
        내가 쓴 리뷰 {openReviewList ? "▲" : "▼"}
      </h3>
      {openReviewList && (
        <>
          {reviews.length === 0 ? (
            <p style={{ marginTop: "10px" }}>작성한 리뷰가 없습니다.</p>
          ) : (
            <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
              {reviews.map((review) => (
                <li key={review.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                  <strong>상품명:</strong> {review.productName} <br />
                  <strong>작성일:</strong> {review.date} <br />

                  {/* 🔹 인라인 수정 중이면 textarea 표시 */}
                  {editingReviewId === review.id ? (
                    <>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        style={{ width: "100%", marginTop: "5px" }}
                      />
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={saveEditing}>저장</button>
                        <button onClick={cancelEditing}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>리뷰:</strong> {review.content}
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={() => startEditing(review)}>수정</button>
                        <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>메인으로</button>
        <button onClick={Logout}>로그아웃</button>
      </div>
    </div>
  );
}

export default Mypage;
