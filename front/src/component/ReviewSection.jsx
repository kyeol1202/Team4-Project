import { useState, useEffect } from "react";
import "../component/mypage.css";

const API_URL = "http://192.168.0.224:8080";

/**
 * @param productId   상품 상세 페이지에서 전달
 * @param userId      로그인 유저 ID
 * @param myPageMode  true: 마이페이지 / false: 상품 상세
 * @param hasPurchased 상품 구매 여부 (상품 상세에서만 사용)
 */
export default function ReviewSection({
  productId = null,
  userId = null,
  myPageMode = false,
  hasPurchased = false,
}) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     리뷰 조회
  ========================= */
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [productId, userId, myPageMode]);

  async function fetchReviews() {
    let url = `${API_URL}/api/reviews`;

    if (myPageMode && userId) {
      url += `?user_id=${userId}`;
    } else if (productId) {
      url += `?product_id=${productId}`;
    }

    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setReviews(data.data);
      else setReviews([]);
    } catch (err) {
      console.error("리뷰 조회 실패:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     리뷰 작성
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          content: newReview,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewReview("");
        setShowForm(false);
        fetchReviews();
      } else {
        alert("리뷰 작성 실패");
      }
    } catch (err) {
      console.error("리뷰 작성 오류:", err);
    }
  }

  /* =========================
     리뷰 삭제 (마이페이지)
  ========================= */
  async function handleDelete(reviewId) {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchReviews();
      else alert("리뷰 삭제 실패");
    } catch (err) {
      console.error("리뷰 삭제 오류:", err);
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="review-section">
      {/* ===== 리뷰 헤더 ===== */}
      <div className="review-header">
        <h2 className="review-title">리뷰</h2>

        {/* ⭐ 리뷰 작성 버튼 (상품 상세 + 구매자만) */}
        {!myPageMode && userId && hasPurchased && (
          <button
            className="review-write-btn"
            onClick={() => setShowForm(!showForm)}
          >
            ✍ 리뷰 작성
          </button>
        )}
      </div>

      {/* ===== 리뷰 작성 폼 ===== */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="상품은 어떠셨나요?"
          />
          <div className="review-form-actions">
            <button type="submit">등록</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* ===== 리뷰 리스트 ===== */}
      <ul className="review-list">
        {loading && <li className="no-reviews">리뷰를 불러오는 중…</li>}

        {!loading && reviews.length === 0 && (
          <li className="no-reviews">아직 작성된 리뷰가 없습니다.</li>
        )}

        {!loading &&
          reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-top">
                <strong className="review-user">
                  {review.user_name || "익명"}
                </strong>
                <span className="review-date">
                  {review.created_at?.slice(0, 10)}
                </span>
              </div>

              <p className="review-content">{review.content}</p>

              {/* 마이페이지에서만 삭제 가능 */}
              {myPageMode && (
                <button
                  className="mypage-btn delete"
                  onClick={() => handleDelete(review.id)}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
