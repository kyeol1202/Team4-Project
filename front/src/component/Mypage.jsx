import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  const userId = localStorage.getItem("userId");
  const isLogin = localStorage.getItem("isLogin") === "true";

  // 로그인 체크 및 데이터 로드
  useEffect(() => {
    if (!isLogin || !userId) {
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
      return;
    }

    setOrders(JSON.parse(localStorage.getItem(`${userId}_orders`)) || []);
    setReviews(JSON.parse(localStorage.getItem(`${userId}_reviews`)) || []);
    setQuestions(JSON.parse(localStorage.getItem(`${userId}_questions`)) || []);
  }, [isLogin, userId, navigate]);

  // 로그아웃 처리 후 메인 페이지 이동
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userId");
    navigate("/", { replace: true }); // 로그아웃 후 메인 페이지 이동
  };

  // 주문 상세보기
  const handleOrderClick = (orderId) => navigate(`/order/${orderId}`);

  // 교환/반품 신청
  const handleReturn = (orderId, productId, type) => {
    if (!window.confirm(`${type} 신청을 진행하시겠습니까?`)) return;

    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      const updatedItems = order.items.map((item) =>
        item.productId === productId
          ? { ...item, returnStatus: `${type}신청중` }
          : item
      );
      return { ...order, items: updatedItems };
    });

    setOrders(updatedOrders);
    localStorage.setItem(`${userId}_orders`, JSON.stringify(updatedOrders));
  };

  // 리뷰 삭제
  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`${userId}_reviews`, JSON.stringify(updatedReviews));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>마이페이지</h2>

      {/* 주문 내역 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenOrderList(!openOrderList)}
      >
        주문 내역 {openOrderList ? "▲" : "▼"}
      </h3>
      {openOrderList && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {orders.length === 0 ? <li>주문 내역이 없습니다.</li> :
            orders.map(order => (
              <li key={order.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0", marginBottom: "15px" }}>
                <p><strong>주문번호:</strong> {order.id}</p>
                {order.items.map(item => (
                  <div key={item.productId} style={{ marginBottom: "10px" }}>
                    <p style={{ fontWeight: "bold" }}>{item.productName}</p>
                    <p>배송: {order.status}</p>
                    <p>교환/반품: {item.returnStatus || "없음"}</p>
                    {(item.returnStatus === "없음" || !item.returnStatus) && (
                      <>
                        <button onClick={() => handleReturn(order.id, item.productId, "교환")}>교환 신청</button>
                        <button onClick={() => handleReturn(order.id, item.productId, "반품")}>반품 신청</button>
                      </>
                    )}
                  </div>
                ))}
                <p style={{ fontWeight: "bold" }}>총 금액: {order.total?.toLocaleString()}원</p>
                <button onClick={() => handleOrderClick(order.id)}>상세보기</button>
              </li>
            ))
          }
        </ul>
      )}

      {/* 내가 쓴 리뷰 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenReviewList(!openReviewList)}
      >
        내가 쓴 리뷰 {openReviewList ? "▲" : "▼"}
      </h3>
      {openReviewList && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {reviews.length === 0 ? <li>작성한 리뷰가 없습니다.</li> :
            reviews.map(review => (
              <li key={review.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                <p style={{ fontWeight: "bold" }}>{review.productName}</p>
                <p>{review.content}</p>
                <button onClick={() => alert("리뷰 수정 기능 준비중")}>수정</button>
                <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
              </li>
            ))
          }
        </ul>
      )}

      {/* 문의 내역 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenQuestionList(!openQuestionList)}
      >
        문의 내역 {openQuestionList ? "▲" : "▼"}
      </h3>
      {openQuestionList && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {questions.length === 0 ? <li>문의 내역이 없습니다.</li> :
            questions.map(q => (
              <li key={q.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                <p><strong>문의:</strong> {q.question}</p>
                <p><strong>답변:</strong> {q.answer || "답변 대기중"}</p>
              </li>
            ))
          }
        </ul>
      )}

      {/* 하단 버튼 */}
      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <button onClick={handleLogout}>로그아웃</button>
        {isLogin && <button onClick={() => navigate("/edituserinfo")}>정보 수정</button>}
      </div>
    </div>
  );
}

export default Mypage;

