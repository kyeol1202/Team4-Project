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
  const [selectedVolume, setSelectedVolume] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [star, setStar] = useState(0); // 별점
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
          if (data.data.volume_options && data.data.volume_options.length > 0) {
            setSelectedVolume(data.data.volume_options[0]);
          }
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

  // 장바구니
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
    if (star === 0) return alert("별점을 선택하세요");
    try {
      const res = await fetch(`${API_URL}/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.product_id,
          content: reviewContent,
          star: star,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("리뷰가 등록되었습니다!");
        setReviewContent("");
        setStar(0);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("리뷰 등록 실패");
    }
  };

  // 스타일
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    fontFamily: "'Noto Sans KR', sans-serif",
  };

  const sectionStyle = {
    marginTop: "35px",
    width: "100%",
    maxWidth: "600px",
    textAlign: "left",
    padding: "20px",
    borderRadius: "10px",
    background: "#f7f7f7",
  };

  const sectionTitleStyle = { fontSize: "20px", fontWeight: "700" };
  const descStyle = { fontSize: "16px", lineHeight: "1.7", color: "#333", whiteSpace: "pre-line" };

  const btnGroupStyle = { marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" };

  return (
    <div style={containerStyle}>
      <img src={`${API_URL}${product.img}`} alt={product.name} style={{ width: "320px", height: "320px", objectFit: "contain", marginBottom: "30px" }} />
      <h1 style={{ fontSize: "34px", fontWeight: "600" }}>{product.name}</h1>
      <p style={{ fontSize: "22px", marginTop: "5px" }}>{product.price?.toLocaleString()}원</p>

      {/* 용량 선택 */}
      {product.volume_options && product.volume_options.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <label>용량 선택: </label>
          <select value={selectedVolume} onChange={(e) => setSelectedVolume(e.target.value)}>
            {product.volume_options.map(vol => (
              <option key={vol} value={vol}>{vol}mL</option>
            ))}
          </select>
        </div>
      )}

      {/* 수량 */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
        <span style={{ margin: "0 8px" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      {/* 버튼 */}
      <div style={btnGroupStyle}>
        <button style={{ color: isInWish ? "red" : "#000" }} onClick={toggleWish}>
          {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
        </button>
        <button onClick={addToCartHandler}>장바구니 담기 🛒</button>
      </div>

      {/* 상품 상세 */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>향수 설명</h2>
        <p style={descStyle}>{product.description}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>향 구성</h2>
        <p><strong>Top:</strong> {product.top_notes || "정보 없음"}</p>
        <p><strong>Middle:</strong> {product.middle_notes || "정보 없음"}</p>
        <p><strong>Base:</strong> {product.base_notes || "정보 없음"}</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>향수 스펙</h2>
        <p><strong>타입:</strong> {product.perfume_type || "정보 없음"}</p>
        <p><strong>용량:</strong> {product.volume || "정보 없음"}mL</p>
        <p><strong>지속력:</strong> {product.longevity || "정보 없음"}/10</p>
        <p><strong>잔향:</strong> {product.sillage || "정보 없음"}</p>
      </div>

      {/* 리뷰 섹션 */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>고객 리뷰</h2>
        <p>구매 리뷰를 확인해보세요</p>
        <small>개인정보 처리방침</small>

        {userId && hasPurchased ? (
          <div style={{ marginTop: "20px" }}>
            <h3>리뷰 작성</h3>
            {/* 별점 선택 */}
            <div style={{ marginBottom: "10px" }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} style={{ fontSize: "24px", cursor: "pointer", color: star >= n ? "gold" : "#ccc" }} onClick={() => setStar(n)}>
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
              <button style={{ padding: "8px 16px", borderRadius: "5px", border: "none", background: "#000", color: "#fff", cursor: "pointer" }} onClick={submitReview}>
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

      {/* 뒤로가기 */}
      <button style={{ marginTop: "40px", fontSize: "17px", color: "#444", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }} onClick={() => navigate(-1)}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;


