import { useState, useEffect } from "react";
import "../component/mypage.css"; 

const API_URL = "http://192.168.0.224:8080";

export default function ReviewSection({ productId = null, userId, myPageMode = false }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    let url = `${API_URL}/api/reviews`;
    if (myPageMode) url += `?user_id=${userId}`;
    else if (productId) url += `?product_id=${productId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setReviews(data.data);
      else setReviews([]);
    } catch (err) {
      console.error("리뷰 불러오기 실패:", err);
      setReviews([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newReview.trim()) return;

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
        fetchReviews();
      } else alert("리뷰 작성 실패");
    } catch (err) {
      console.error("리뷰 작성 오류:", err);
    }
  }

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

  return (
    <div className="review-section">
      <form className="review-form" onSubmit={handleSubmit}>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="리뷰를 작성하세요."
        />
        <button type="submit">작성</button>
      </form>

      <ul className="review-list">
        {reviews.length ? (
          reviews.map((review) => (
            <li key={review.id} className="review-item">
              <strong>{review.user_name || "익명"}</strong>
              <p>{review.content}</p>
              {myPageMode && (
                <button className="mypage-btn" onClick={() => handleDelete(review.id)}>
                  삭제
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="no-reviews">리뷰가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
