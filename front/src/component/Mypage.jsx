import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Mypage.css"; // CSS import

function Mypage() {
  const navigate = useNavigate();
  // const { isLogin, logout, user } = useAuth();
  const userId = "user1"; // 예시용, 실제로는 로그인 유저 id 사용

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  // useEffect(() => {
  //   if (!isLogin) {
  //     navigate("/", { replace: true });
  //   } else {
  //     setOrders(JSON.parse(localStorage.getItem(`${userId}_orders`)) || []);
  //     setReviews(JSON.parse(localStorage.getItem(`${userId}_reviews`)) || []);
  //     setQuestions(JSON.parse(localStorage.getItem(`${userId}_questions`)) || []);
  //   }
  // }, [isLogin, navigate]);
 // 로그인 체크 및 데이터 로드
  useEffect(() => {
    if (!isLogin) {
      navigate("/", { replace: true }); // 로그인 안 됐으면 홈 이동
     return; 
    }
     setOrders(JSON.parse(localStorage.getItem("orders")) || []);
     setReviews(JSON.parse(localStorage.getItem("reviews")) || []);
     setQuestions(JSON.parse(localStorage.getItem("questions")) || []);
    }, [isLogin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleOrderClick = (orderId) => navigate(`/order/${orderId}`);

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

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`${userId}_reviews`, JSON.stringify(updatedReviews));
  };

  const handleEditReview = (review) => {
    alert(`리뷰 수정 준비중: ${review.productName}`);
  };

  return (
    <div className="mypage-container">
      {/* 상단 버튼 */}
      <div className="mypage-actions">
        <button className="mypage-btn" onClick={handleLogout}>로그아웃</button>
        <button className="mypage-btn" onClick={() => navigate("/edituserinfo")}>정보 수정</button>
      </div>

      {/* 주문 내역 */}
      <section className="mypage-section">
        <h3
          className="mypage-section-title"
          onClick={() => setOpenOrderList(!openOrderList)}
        >
          주문 내역 {openOrderList ? "▲" : "▼"}
        </h3>
        {openOrderList && (
          <div className="card-list">
            {orders.length === 0 ? (
              <p>주문 내역이 없습니다.</p>
            ) : (
              orders.map((order) => (
                <div className="card-item" key={order.id}>
                  <p><strong>주문번호:</strong> {order.id}</p>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div className="order-item-card" key={item.productId}>
                        <p className="item-name">{item.productName}</p>
                        <p>
                          <strong>배송:</strong>{" "}
                          <span className={`status-${order.status}`}>{order.status}</span>
                        </p>
                        <p>
                          <strong>교환/반품:</strong>{" "}
                          <span className={`return-${item.returnStatus || "없음"}`}>
                            {item.returnStatus || "없음"}
                          </span>
                        </p>
                        {(item.returnStatus === "없음" || !item.returnStatus) && (
                          <div className="return-buttons">
                            <button className="mypage-btn" onClick={() => handleReturn(order.id, item.productId, "교환")}>교환 신청</button>
                            <button className="mypage-btn" onClick={() => handleReturn(order.id, item.productId, "반품")}>반품 신청</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="order-total">총 금액: {order.total?.toLocaleString() || 0}원</p>
                  <button className="mypage-btn" onClick={() => handleOrderClick(order.id)}>상세보기</button>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* 내가 쓴 리뷰 */}
      <section className="mypage-section">
        <h3
          className="mypage-section-title"
          onClick={() => setOpenReviewList(!openReviewList)}
        >
          내가 쓴 리뷰 {openReviewList ? "▲" : "▼"}
        </h3>
        {openReviewList && (
          <div className="card-list">
            {reviews.length === 0 ? (
              <p>작성한 리뷰가 없습니다.</p>
            ) : (
              reviews.map((review) => (
                <div className="card-item" key={review.id}>
                  <p><strong>상품명:</strong> {review.productName}</p>
                  <p>{review.content}</p>
                  <div className="review-buttons">
                    <button className="mypage-btn" onClick={() => handleEditReview(review)}>수정</button>
                    <button className="mypage-btn" onClick={() => handleDeleteReview(review.id)}>삭제</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* 문의 내역 */}
      <section className="mypage-section">
        <h3
          className="mypage-section-title"
          onClick={() => setOpenQuestionList(!openQuestionList)}
        >
          문의 내역 {openQuestionList ? "▲" : "▼"}
        </h3>
        {openQuestionList && (
          <div className="card-list">
            {questions.length === 0 ? (
              <p>문의 내역이 없습니다.</p>
            ) : (
              questions.map((q) => (
                <div className="card-item" key={q.id}>
                  <p><strong>문의:</strong> {q.question}</p>
                  <p><strong>답변:</strong> {q.answer || "답변 대기중"}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Mypage;
