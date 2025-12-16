import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../component/mypage.css";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://192.168.0.224:8080";


function Mypage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = localStorage.getItem("member_id") || user?.id;

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [openOrderList, setOpenOrderList] = useState(false);
  const [openReviewList, setOpenReviewList] = useState(false);
  const [openQuestionList, setOpenQuestionList] = useState(false);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const isAdmin = localStorage.getItem("role") === "ADMIN";


  //검색어 처리(관리자 용)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword");             // URL 검색어
  const searchKeyword = keyword?.toLowerCase();      // 검색용 변환
  const [adminOrders, setAdminOrders] = useState([]);

  // ⭐ 관리자 전용 검색 결과
  const [searchInput, setSearchInput] = useState("");   // 입력창 검색어
  const [products, setProducts] = useState([]);         // 검색된 상품 리스트
  // const [products, setProducts] = useState([]);         // 검색된 상품 리스트

  const ORDER_STATUS_KR = {
    ready: "결제 완료",
    shipping: "출고 처리 중",
    done: "주문 완료",
  };

  const ORDER_STATUS_TEXT = {
    pending: "상품 준비중",
    paid: "배송 준비 완료",
    shipping: "배송 중",
    completed: "배송 완료",
    cancel: "주문 취소",
  };

  //관리자전용 주문내역 조회
  useEffect(() => {
    if (localStorage.getItem("role") !== "ADMIN") return;

    fetch("http://192.168.0.224:8080/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdminOrders(data.data);
        }
      });
  }, []);

  // 로그인 체크 + 데이터 로드
  useEffect(() => {
    const loginCheck = localStorage.getItem("login");
    const role = localStorage.getItem("role");

    if (loginCheck !== "true" && role !== "ADMIN") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/order/${userId}`);
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setOrders(JSON.parse(localStorage.getItem("orders")) || []);
        }
      } catch {
        setOrders(JSON.parse(localStorage.getItem("orders")) || []);
      }
    })();

    setReviews(JSON.parse(localStorage.getItem("reviews")) || []);
    setQuestions(JSON.parse(localStorage.getItem("questions")) || []);
  }, []);



  // ⭐⭐⭐ 7) 관리자 검색 API 실행(useEffect는 반드시 return 위에!)
  useEffect(() => {
    // ADMIN이 아니면 실행하지 않음
    if (localStorage.getItem("role") !== "ADMIN") return;

    if (localStorage.getItem("role") !== "ADMIN") return;
    if (!searchKeyword) return;

    fetch(`${API_URL}/admin/search?keyword=${searchKeyword}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdminOrders(data.data);
        }
      })
      .catch(err => console.log("검색 에러:", err));
  }, [searchKeyword]);

  function search() {
    if (!searchInput.trim()) return alert("검색어를 입력하세요!");
    // ⭐ URL에 검색어를 넣어서 state 업데이트
    navigate(`/mypage?keyword=${searchInput}`);
  }

  // 로그아웃
  const handleLogout = () => {
    localStorage.setItem("login", "false");
    localStorage.setItem("role", "null");
    localStorage.removeItem("member_id");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    alert("로그아웃 되었습니다.");
    navigate("/main");
    navigate(0);
  };

  const handleOrderClick = (orderId) => navigate(`/order/${orderId}`);

  // ✅ 반품/교환 버튼 클릭 시 Returns 페이지로 이동
  const handleReturn = (orderId, productId, type) => {
    navigate(`/returns?orderId=${orderId}&productId=${productId}&type=${type}`);
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

      {(localStorage.getItem("role") === "USER") && (
        <>
          {/* 주문 내역 */}
          <section className="mypage-section">
            <h3 className="mypage-section-title" onClick={() => setOpenOrderList(!openOrderList)}>
              주문 내역 {openOrderList ? "▲" : "▼"}
            </h3>

            {openOrderList && (
              <div className="card-list">
                {orders.length === 0 ? (
                  <p>주문 내역이 없습니다.</p>
                ) : (
                  orders.map((order) => (
                    <div className="card-item" key={order.id}>
                      <p><strong>주문번호:</strong> {order.orderNumber}</p>

                      <div className="order-items">
                        {order.items.map((item) => (
                          <div className="order-item-card" key={item.productId}>
                            <p className="item-name">{item.productName}</p>

                            <p>
                              <strong>배송 상태:</strong>
                              <span className={`status-${order.status}`}>
                                {ORDER_STATUS_TEXT[order.status] || order.status}
                              </span>
                            </p>

                            <p>
                              <strong>교환/반품:</strong>{" "}
                              <span className={`return-${item.returnStatus || "없음"}`}>
                                {item.returnStatus || "없음"}
                              </span>
                            </p>

                            {(item.returnStatus === "없음" || !item.returnStatus) && (
                              <div className="return-buttons">
                                <button
                                  className="mypage-btn"
                                  onClick={() => handleReturn(order.id, item.productId, "교환")}
                                >
                                  교환 신청
                                </button>

                                <button
                                  className="mypage-btn"
                                  onClick={() => handleReturn(order.id, item.productId, "반품")}
                                >
                                  반품 신청
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <p className="order-total">
                        총 금액: {order.total.toLocaleString()}원
                      </p>

                      {/* <button
                        className="mypage-btn"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        상세보기
                      </button> */}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* 내가 쓴 리뷰 */}
          <section className="mypage-section">
            <h3 className="mypage-section-title" onClick={() => setOpenReviewList(!openReviewList)}>
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
                        <button className="mypage-btn" onClick={() => handleEditReview(review)}>
                          수정
                        </button>
                        <button className="mypage-btn" onClick={() => handleDeleteReview(review.id)}>
                          삭제
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* 문의 내역 */}
          <section className="mypage-section">
            <h3 className="mypage-section-title" onClick={() => setOpenQuestionList(!openQuestionList)}>
              문의 내역 {openQuestionList ? "▲" : "▼"}
            </h3>

            {openQuestionList && (
              <div className="card-list">
                {questions.filter((q) => q.usrId === userId).length === 0 ? (
                  <p>문의 내역이 없습니다.</p>
                ) : (
                  questions
                    .filter((q) => q.usrId === userId)
                    .map((q, idx) => (
                      <div
                        className="card-item"
                        key={q.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpenQuestionIndex(openQuestionIndex === idx ? null : idx)}
                      >
                        <p><strong>{idx + 1}번 문의:</strong> {q.inquiryType}</p>

                        {openQuestionIndex === idx && (
                          <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
                            <textarea
                              value={q.question}
                              onChange={(e) => {
                                const updated = questions.map((item) =>
                                  item.id === q.id
                                    ? { ...item, question: e.target.value }
                                    : item
                                );
                                setQuestions(updated);
                                localStorage.setItem("questions", JSON.stringify(updated));
                              }}
                              rows={3}
                              style={{ width: "100%" }}
                            />

                            <p><strong>답변:</strong> {q.answer || "답변 대기중"}</p>
                            <p><small>작성일: {new Date(q.createdAt).toLocaleString()}</small></p>

                            <div>
                              <button
                                onClick={() => {
                                  if (!window.confirm("이 문의를 삭제하시겠습니까?")) return;
                                  const updated = questions.filter((item) => item.id !== q.id);
                                  setQuestions(updated);
                                  localStorage.setItem("questions", JSON.stringify(updated));
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* ================= ADMIN 화면 ================= */}
      {isAdmin && (
        <>
          <h2>관리자 페이지</h2>

          <div className="search-box">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어 입력"
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button className="mypage-btn" onClick={search}>검색</button>
          </div>

          {products.length > 0 && (
            <div className="admin-search-grid">
              {products.map((item) => (
                <div key={item.member_id} className="admin-product-card">
                  <h4>{item.name}</h4>
                </div>
              ))}
            </div>
          )}


          {/* ================= ADMIN 주문내역 ================= */}


          <h3 style={{ marginTop: "40px" }}>주문 내역</h3>

          {adminOrders.length > 0 ? (
            <div className="admin-search-grid">
              {adminOrders.map(order => (
                <div key={order.order_id} className="admin-product-card">

                  <p><strong>주문번호:</strong> {order.order_number}</p>
                  <p><strong>구매자:</strong> {order.member_name}</p>
                  <p>
                    <strong>금액:</strong>{" "}
                    {order.total_amount
                      ? order.total_amount.toLocaleString()
                      : "0"}원
                  </p>
                  {/* ✅ 주문 상태 변경 */}
                  <p>
                    <strong>주문 상태:</strong>{" "}
                    {editingOrderId === order.order_id ? (
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;

                          await fetch(`${API_URL}/admin/order/status`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              order_id: order.order_id,
                              status: newStatus,
                            }),
                          });

                          setAdminOrders(prev =>
                            prev.map(o =>
                              o.order_id === order.order_id
                                ? { ...o, status: newStatus }
                                : o
                            )
                          );
                        }}
                      >
                        <option value="ready">결제 완료</option>
                        <option value="shipping">출고 처리 중</option>
                        <option value="done">주문 완료</option>
                      </select>
                    ) : (
                      <span>{ORDER_STATUS_KR[order.status]}</span>
                    )}
                  </p>

                  {/* ✅ 배송 상태 변경 */}
                  <p>
                    <strong>배송 상태:</strong>{" "}
                    {editingOrderId === order.order_id ? (
                      <select
                        value={order.order_status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;

                          await fetch(`${API_URL}/admin/order/delivery`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              order_id: order.order_id,
                              order_status: newStatus,
                            }),
                          });

                          setAdminOrders(prev =>
                            prev.map(o =>
                              o.order_id === order.order_id
                                ? { ...o, order_status: newStatus }
                                : o
                            )
                          );
                        }}
                      >
                        <option value="pending">상품 준비중</option>
                        <option value="paid">배송 준비 완료</option>
                        <option value="shipping">배송 중</option>
                        <option value="completed">배송 완료</option>
                        <option value="cancel">주문 취소</option>
                      </select>
                    ) : (
                      <span>{ORDER_STATUS_TEXT[order.order_status]}</span>
                    )}
                  </p>

                  <div className="admin-order-actions">
                    {editingOrderId === order.order_id ? (
                      <button
                        className="mypage-btn"
                        onClick={() => setEditingOrderId(null)}
                      >
                        저장
                      </button>
                    ) : (
                      <button
                        className="mypage-btn"
                        onClick={() => setEditingOrderId(order.order_id)}
                      >
                        수정
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p>주문 내역이 없습니다.</p>
          )}
        </>
      )}

    </div>


  );
}

export default Mypage;
