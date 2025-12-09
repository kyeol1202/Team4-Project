import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
  const navigate = useNavigate();
  // const { isLogin, logout, user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

 // 로그인 체크 및 데이터 로드
  // useEffect(() => {
  //   if (!isLogin) {
  //     navigate("/", { replace: true }); // 로그인 안 됐으면 홈 이동
  //    return; 
  //   }
  //    setOrders(JSON.parse(localStorage.getItem("orders")) || []);
  //    setReviews(JSON.parse(localStorage.getItem("reviews")) || []);
  //    setQuestions(JSON.parse(localStorage.getItem("questions")) || []);
  //   }, [isLogin, navigate]);

  // 로그아웃
 function handleLogout(){
  localStorage.setItem("login", "false");
  localStorage.setItem("user", JSON.stringify(null));

  alert(`로그아웃 되었습니다.`);

  // 🔥 여기서 setLogin은 필요 없음
  // Layout이 자동으로 감지함
  
  navigate("/main");
}

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


  // 리뷰 수정 (alert, 추후 모달/페이지 확장 가능)
  const handleEditReview = (review) => {
    alert(`리뷰 수정 준비중: ${review.productName}`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>마이페이지</h2>

      {/* 상단 버튼 */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleLogout}>로그아웃</button>
        <button onClick={() => navigate("/edituserinfo")} style={{ marginLeft: "10px" }}>
          정보 수정
        </button>
      </div>

      {/* 주문 내역 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenOrderList(!openOrderList)}
      >
        주문 내역 {openOrderList ? "▲" : "▼"}
      </h3>
      {openOrderList && (
        <>
          {orders.length === 0 ? (
            <p style={{ marginTop: "10px" }}>주문 내역이 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
              {orders.map((order) => (
                <li
                  key={order.id}
                  style={{ borderBottom: "1px solid #ddd", padding: "10px 0", marginBottom: "15px" }}
                >
                  <p><strong>주문번호:</strong> {order.id}</p>
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        style={{
                          width: "150px",
                          textAlign: "center",
                          border: "1px solid #eee",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        <p style={{ marginTop: "5px", fontWeight: "bold" }}>{item.productName}</p>
                        <p>
                          <strong>배송:</strong>{" "}
                          <span
                            style={{
                              color:
                                order.status === "배송완료"
                                  ? "green"
                                  : order.status === "배송중"
                                  ? "orange"
                                  : "gray",
                              fontWeight: "bold",
                            }}
                          >
                            {order.status}
                          </span>
                        </p>
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
                            <button onClick={() => handleReturn(order.id, item.productId, "교환")}>교환 신청</button>
                            <button onClick={() => handleReturn(order.id, item.productId, "반품")}>반품 신청</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ marginTop: "10px", fontWeight: "bold" }}>총 금액: {order.total?.toLocaleString() || 0}원</p>
                  <button onClick={() => handleOrderClick(order.id)} style={{ marginTop: "5px" }}>상세보기</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 내가 쓴 리뷰 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenReviewList(!openReviewList)}
      >
        내가 쓴 리뷰 {openReviewList ? "▲" : "▼"}
      </h3>
      {openReviewList && (
        <>
          {reviews.length === 0 ? (
            <p style={{ marginTop: "10px" }}>작성한 리뷰가 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
              {reviews.map((review) => (
                <li key={review.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                  <p><strong>상품명:</strong> {review.productName}</p>
                  <p>{review.content}</p>
                  <button onClick={() => handleEditReview(review)}>수정</button>
                  <button style={{ marginLeft: "5px" }} onClick={() => handleDeleteReview(review.id)}>삭제</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 문의 내역 */}
      <h3
        style={{ cursor: "pointer", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenQuestionList(!openQuestionList)}
      >
        문의 내역 {openQuestionList ? "▲" : "▼"}
      </h3>
      {openQuestionList && (
        <>
          {questions.length === 0 ? (
            <p style={{ marginTop: "10px" }}>문의 내역이 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
              {questions.map((q) => (
                <li key={q.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                  <p><strong>문의:</strong> {q.question}</p>
                  <p><strong>답변:</strong> {q.answer || "답변 대기중"}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Mypage;

