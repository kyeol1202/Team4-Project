import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Mypage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 토글 상태
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);

  // 🔹 리뷰 인라인 편집 상태
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // 🔹 문의 인라인 편집 상태
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedOrders = localStorage.getItem("orders");
    const storedReviews = localStorage.getItem("reviews");
    const storedQuestions = localStorage.getItem("questions");

    if (!storedUser) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
      setOrders(JSON.parse(storedOrders) || []);
      setReviews(JSON.parse(storedReviews) || []);
      setQuestions(JSON.parse(storedQuestions) || []);
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

  /** 리뷰 관련 */
  const startEditingReview = (review) => {
    setEditingReviewId(review.id);
    setEditingText(review.content);
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditingText("");
  };

  const saveEditingReview = () => {
    const updatedReviews = reviews.map((r) =>
      r.id === editingReviewId ? { ...r, content: editingText } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setEditingReviewId(null);
    setEditingText("");
  };

  const deleteReview = (reviewId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const updatedReviews = reviews.filter((r) => r.id !== reviewId);
      setReviews(updatedReviews);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    }
  };

  /** 문의 관련 */
  const startEditingQuestion = (question) => {
    setEditingQuestionId(question.id);
    setEditingQuestionText(question.content);
  };

  const cancelEditingQuestion = () => {
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const saveEditingQuestion = () => {
    const updatedQuestions = questions.map((q) =>
      q.id === editingQuestionId ? { ...q, content: editingQuestionText } : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const deleteQuestion = (questionId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    }
  };

  const Logout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate("/", { replace: true });
  };

  const handleEditInfo = () => {
    alert("회원 정보 수정 페이지로 이동합니다.");
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
                  {editingReviewId === review.id ? (
                    <>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        style={{ width: "100%", marginTop: "5px" }}
                      />
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={saveEditingReview}>저장</button>
                        <button onClick={cancelEditingReview}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>리뷰:</strong> {review.content}
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={() => startEditingReview(review)}>수정</button>
                        <button onClick={() => deleteReview(review.id)}>삭제</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 문의 내역 */}
      <h3
        style={{ cursor: "pointer", userSelect: "none", borderBottom: "1px solid #aaa", paddingBottom: "10px", marginTop: "25px" }}
        onClick={() => setOpenQuestionList(!openQuestionList)}
      >
        문의 내역 {openQuestionList ? "▲" : "▼"}
      </h3>
      {openQuestionList && (
        <>
          {questions.length === 0 ? (
            <p style={{ marginTop: "10px" }}>작성한 문의가 없습니다.</p>
          ) : (
            <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
              {questions.map((q) => (
                <li key={q.id} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                  <strong>제목:</strong> {q.title} <br />
                  {editingQuestionId === q.id ? (
                    <>
                      <textarea
                        value={editingQuestionText}
                        onChange={(e) => setEditingQuestionText(e.target.value)}
                        rows={3}
                        style={{ width: "100%", marginTop: "5px" }}
                      />
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={saveEditingQuestion}>저장</button>
                        <button onClick={cancelEditingQuestion}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>문의 내용:</strong> {q.content} <br />
                      <strong>답변:</strong> {q.answer || "답변 대기 중"} <br />
                      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                        <button onClick={() => startEditingQuestion(q)}>수정</button>
                        <button onClick={() => deleteQuestion(q.id)}>삭제</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* 하단 버튼 */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")}>메인으로</button>
        <button onClick={Logout}>로그아웃</button>
        <button onClick={() => handleEditInfo()}>정보 수정</button>
      </div>
    </div>
  );
}

export default Mypage;
