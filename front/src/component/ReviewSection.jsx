import { useEffect, useState } from "react";
import "./review.css";

const API_URL = "http://192.168.0.224:8080";

export default function ReviewSection({
  productId = null,     // 상품 상세일 때만 전달
  userId,
  myPageMode = false,   // 마이페이지 여부
  hasPurchased = true,  // 상품 상세에서 구매 여부
}) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newStar, setNewStar] = useState(0);
  const [showForm, setShowForm] = useState(false);

  /* ===================== 리뷰 불러오기 ===================== */
  useEffect(() => {
    if (myPageMode && userId) {
      // 내가 쓴 리뷰
      fetch(`${API_URL}/api/review/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.reviews);
        });
    }

    if (!myPageMode && productId) {
      // 상품 전체 리뷰
      fetch(`${API_URL}/api/review/product/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.reviews);
        });
    }
  }, [productId, userId, myPageMode]);

  /* ===================== 리뷰 등록 ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || newStar === 0) return;

    const res = await fetch(`${API_URL}/api/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        content: newReview,
        star: newStar,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setReviews([data.review, ...reviews]);
      setNewReview("");
      setNewStar(0);
      setShowForm(false);
    }
  };

  /* ===================== 리뷰 삭제 ===================== */
  const handleDelete = async (reviewId) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

    await fetch(`${API_URL}/api/review/${reviewId}`, {
      method: "DELETE",
    });

    setReviews(reviews.filter(r => r.review_id !== reviewId));
  };

  return (
    <div className="review-section">
      <h3 className="review-title">리뷰</h3>

      {/* ================= 작성 버튼 ================= */}
      {!myPageMode && hasPurchased && (
        <button
          className="review-write-btn"
          onClick={() => setShowForm(!showForm)}
        >
          리뷰 작성
        </button>
      )}

      {/* ================= 작성 폼 ================= */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          {/* ⭐ 별점 */}
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                onClick={() => setNewStar(n)}
                className={n <= newStar ? "star active" : "star"}
              >
                ★
              </span>
            ))}
          </div>

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

      {/* ================= 리뷰 리스트 ================= */}
      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="no-review">리뷰가 없습니다.</p>
        ) : (
          reviews.map(review => (
            <div key={review.review_id} className="review-card">
              <div className="review-top">
                <strong>{review.user_name || "익명"}</strong>

                <span className="review-stars-view">
                  {"★".repeat(review.star)}
                  {"☆".repeat(5 - review.star)}
                </span>

                <span className="review-date">
                  {review.created_at?.slice(0, 10)}
                </span>
              </div>

              <p className="review-content">{review.content}</p>

              {/* 마이페이지일 때만 삭제 */}
              {myPageMode && (
                <button
                  className="review-delete-btn"
                  onClick={() => handleDelete(review.review_id)}
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
