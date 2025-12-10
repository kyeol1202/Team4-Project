import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
import { useCart } from "../context/CartContext";

const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishList, addToWish, removeFromWish } = useWish();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);

  // 구매 여부 체크
  const [hasPurchased, setHasPurchased] = useState(false);
  const userId = localStorage.getItem("member_id");

  // 리뷰 입력
  const [reviewContent, setReviewContent] = useState("");
  const [reviewStar, setReviewStar] = useState(5);

  // 예시 리뷰 (실제 데이터는 API 연동)
  const exampleReviews = [
    { id: 1, name: "나닝이", star: 5, content: "에쌍스짱짱-디올은 모든향이 전부좋아요" },
    { id: 2, name: "포스1", star: 5, content: "역쉬 크리스찬 디올~! 디올이 디올 했네요~" },
    { id: 3, name: "핑크공주", star: 5, content: "향기테라피, 하루종일 기분 좋아요" },
    { id: 4, name: "쩡이당", star: 5, content: "첫향 달콤하고, 잔향 은은하게 남아요" },
  ];

  // 상품 상세 불러오기
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
          setIsInWish(
            wishList.some((item) => item.product_id === data.data.product_id)
          );
        }
      })
      .catch((err) => console.error("상품 상세 오류:", err));
  }, [id, wishList]);

  // 구매 여부 확인
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHasPurchased(data.purchased);
      })
      .catch(err => console.error("구매 여부 체크 오류:", err));
  }, [userId, id]);

  if (!product) return <div style={{ padding: 40 }}>Loading...</div>;

  // 위시리스트 토글
  const toggleWish = () => {
    if (isInWish) {
      removeFromWish(product.product_id);
      setIsInWish(false);
    } else {
      addToWish({ product_id: product.product_id });
      setIsInWish(true);
    }
  };

  // 장바구니 담기
  const addToCartHandler = async () => {
    if (!userId) return alert("로그인이 필요합니다!");

    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.product_id,
          count: quantity,
        }),
      });

      const data = await res.json();
      if (data.success) alert("장바구니에 담았습니다!");
      else alert(data.message);
    } catch {
      alert("장바구니 오류");
    }
  };

  // 리뷰 작성
  const submitReview = async () => {
    if (!reviewContent.trim()) return alert("리뷰 내용을 입력하세요");
    try {
      const res = await fetch(`${API_URL}/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.product_id,
          content: reviewContent,
          star: reviewStar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("리뷰가 등록되었습니다!");
        setReviewContent("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("리뷰 등록 실패");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "'Noto Sans KR', sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      {/* 상품 이미지 */}
      <img src={`${API_URL}${product.img}`} alt={product.name} style={{ width: "320px", height: "320px", objectFit: "contain", margin: "0 auto", display: "block" }} />

      <h1 style={{ fontSize: "34px", fontWeight: "600", textAlign: "center", marginTop: "20px" }}>{product.name}</h1>
      <p style={{ fontSize: "22px", textAlign: "center", marginTop: "5px" }}>{product.price?.toLocaleString()}원</p>

      {/* 수량 선택 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
        <span style={{ margin: "0 10px" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      {/* 버튼 그룹 */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px" }}>
        <button onClick={toggleWish} style={{ color: isInWish ? "red" : "#000" }}>
          {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
        </button>
        <button onClick={addToCartHandler}>장바구니 담기 🛒</button>
      </div>

      {/* 상품 상세 */}
      <div style={{ marginTop: "40px", padding: "20px", background: "#f7f7f7", borderRadius: "10px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>향수 설명</h2>
        <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333" }}>{product.description}</p>

        <h2 style={{ fontSize: "20px", fontWeight: "700", marginTop: "20px" }}>향 구성</h2>
        <p><strong>Top:</strong> {product.top_notes || "정보 없음"}</p>
        <p><strong>Middle:</strong> {product.middle_notes || "정보 없음"}</p>
        <p><strong>Base:</strong> {product.base_notes || "정보 없음"}</p>

        <h2 style={{ fontSize: "20px", fontWeight: "700", marginTop: "20px" }}>향수 스펙</h2>
        <p><strong>타입:</strong> {product.perfume_type || "정보 없음"}</p>
        <p><strong>용량:</strong> {product.volume || "정보 없음"} mL</p>
        <p><strong>지속력 (Longevity):</strong> {product.longevity || "정보 없음"}/10</p>
        <p><strong>잔향 (Sillage):</strong> {product.sillage || "정보 없음"}</p>
      </div>

      {/* 리뷰 섹션 */}
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700" }}>고객 리뷰</h2>
        <p>구매 리뷰를 확인해보세요</p>

        {/* 리뷰 카드 */}
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          {exampleReviews.map(review => (
            <div key={review.id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", marginBottom: "15px" }}>
              <div style={{ fontWeight: "600", marginBottom: "5px" }}>{review.name}</div>
              <div style={{ color: "gold", marginBottom: "8px" }}>
                {"★".repeat(review.star) + "☆".repeat(5 - review.star)}
              </div>
              <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.5" }}>{review.content}</div>
            </div>
          ))}
        </div>

       {/* 리뷰 작성폼 (구매 고객만) */}
{userId && hasPurchased ? (
  <div style={{ marginTop: "20px", textAlign: "left" }}>
    <h3 style={{ fontWeight: "600" }}>리뷰 작성</h3>

    {/* 별점 선택 */}
    <div style={{ marginBottom: "10px" }}>
      <label style={{ marginRight: "10px" }}>별점:</label>
      {[1,2,3,4,5].map((n) => (
        <span
          key={n}
          onClick={() => setReviewStar(n)}
          style={{
            cursor: "pointer",
            color: n <= reviewStar ? "gold" : "#ccc",
            fontSize: "24px",
            marginRight: "3px",
          }}
        >
          ★
        </span>
      ))}
    </div>

    <textarea
      placeholder="리뷰 내용을 입력하세요"
      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" }}
      value={reviewContent}
      onChange={(e) => setReviewContent(e.target.value)}
    />

    <div style={{ marginTop: "10px", textAlign: "right" }}>
      <button
        onClick={submitReview}
        style={{
          padding: "8px 16px",
          borderRadius: "5px",
          border: "none",
          background: "#000",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        작성
      </button>
    </div>
  </div>
) : (
  <p style={{ color: "#f00", marginTop: "10px" }}>
    리뷰 작성은 구매 고객만 가능합니다. 로그인 후 구매 내역이 있어야 작성할 수 있습니다.
  </p>
)}


      {/* 뒤로가기 */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "40px", fontSize: "17px", color: "#444", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;
