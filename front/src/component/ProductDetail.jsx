import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWish } = useWish();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
      })
      .catch((err) => console.error("상품 상세 오류:", err));
  }, [id]);

  if (!product) return <div style={{ padding: 40 }}>Loading...</div>;

  // 위시리스트 추가 (Context 사용)
  const addToWishHandler = () => {
    addToWish(product);
  };

  // 장바구니 추가
  const addToCart = () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    fetch("http://localhost:8080/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_id: product.product_id,
        count: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.success
          ? alert("장바구니에 담았습니다!")
          : alert("이미 장바구니에 있는 상품입니다.");
      })
      .catch((err) => console.error("장바구니 오류:", err));
  };

  return (
    <div style={styles.container}>
      
      {/* 이미지 */}
      <img 
        src={`http://localhost:8080${product.img}`} 
        alt={product.name} 
        style={styles.image} 
      />

      {/* 상품 기본 정보 */}
      <h1 style={styles.name}>{product.name}</h1>
      <p style={styles.price}>{product.price?.toLocaleString()}원</p>

      {/* 상세 설명 섹션 */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 설명</h2>
        <p style={styles.desc}>{product.description}</p>
      </div>

      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향 구성 (Notes)</h2>
        <p><strong>Top Notes:</strong> {product.top_notes || "정보 없음"}</p>
        <p><strong>Middle Notes:</strong> {product.middle_not || "정보 없음"}</p>
        <p><strong>Base Notes:</strong> {product.base_notes || "정보 없음"}</p>
      </div>

      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 스펙</h2>
        <p><strong>타입:</strong> {product.perfume_type || "정보 없음"}</p>
        <p><strong>용량:</strong> {product.volume || "정보 없음"}mL</p>
        <p><strong>지속력 (Longevity):</strong> {product.longevity || "정보 없음"}/10</p>
        <p><strong>잔향 (Sillage):</strong> {product.sillage || "정보 없음"}</p>
      </div>

      {/* 버튼 그룹 */}
      <div style={styles.btnGroup}>
        <button style={styles.wishBtn} onClick={addToWishHandler}>
          ♡ 위시리스트
        </button>
        <button style={styles.cartBtn} onClick={addToCart}>
          장바구니 담기 🛒
        </button>
      </div>

      {/* 뒤로가기 */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    color: "#000",
    fontFamily: "'Noto Sans KR', sans-serif",
  },

  image: {
    width: "320px",
    height: "320px",
    objectFit: "contain",
    marginBottom: "30px",
  },

  name: {
    fontSize: "34px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  price: {
    fontSize: "22px",
    marginTop: "5px",
  },

  desc: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#333",
    whiteSpace: "pre-line"
  },

  sectionBox: {
    marginTop: "35px",
    textAlign: "left",
    maxWidth: "600px",
    margin: "35px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#f7f7f7",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  btnGroup: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },

  wishBtn: {
    border: "1px solid #aaa",
    padding: "10px 20px",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "16px",
  },

  cartBtn: {
    background: "black",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },

  backBtn: {
    marginTop: "40px",
    fontSize: "17px", 
    color: "#444",
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

export default ProductDetail;