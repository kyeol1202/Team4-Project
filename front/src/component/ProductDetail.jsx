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

  // 상품 상세 불러오기
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setIsInWish(wishList.some(item => item.product_id === data.data.product_id));
        }
      })
      .catch(err => console.error("상품 상세 오류:", err));
  }, [id, wishList]);

  // 구매 여부 확인
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHasPurchased(data.purchased); // purchased: true/false
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
  const [reviewContent, setReviewContent] = useState("");
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
    <div style={{ padding: "40px", fontFamily: "'Noto Sans KR', sans-serif" }}>
      <img src={`${API_URL}${product.img}`} alt={product.name} style={{ width: "320px", height: "320px", objectFit: "contain", marginBottom: "30px" }} />
      <h1 style={{ fontSize: "34px", fontWeight: "600" }}>{product.name}</h1>
      <p style={{ fontSize: "22px", marginTop: "5px" }}>{product.price?.toLocaleString()}원</p>

      {/* 수량 선택 */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
        <span style={{ margin: "0 8px" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      {/* 버튼 그룹 */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={toggleWish} style={{ color: isInWish ? "red" : "#000" }}>
          {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
        </button>
        <button onClick={addToCartHandler}>장바구니 담기 🛒</button>
      </div>

      {/* 리뷰 섹션 */}
      <div style={{ marginTop: "50px", maxWidth: "600px", margin: "50px auto", padding: "20px", borderRadius: "10px", background: "#f7f7f7" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>고객 리뷰</h2>
        <p>구매 리뷰를 확인해보세요</p>
        <small>개인정보 처리방침</small>

        {/* 리뷰 작성 폼 (구매한 고객만) */}
        {userId && hasPurchased ? (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontWeight: "600" }}>리뷰 작성</h3>
            <textarea
              placeholder="리뷰 내용을 입력하세요"
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px" }}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button
                style={{ padding: "8px 16px", borderRadius: "5px", border: "none", background: "#000", color: "#fff", cursor: "pointer" }}
                onClick={submitReview}
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
      </div>
    </div>
  );
}

export default ProductDetail;

