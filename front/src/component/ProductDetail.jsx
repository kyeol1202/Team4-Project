// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();              // URL에서 productId 가져오기
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  // 🔥 상세정보 불러오기
  useEffect(() => {
    fetch(`http://192.168.0.224:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={styles.container}>

      {/* 뒤로가기 */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* 상품 이미지 */}
      <img src={product.img} alt={product.name} style={styles.image} />

      {/* 상품 정보 */}
      <h1 style={styles.name}>{product.name}</h1>
      <p style={styles.price}>{product.price}원</p>

      <p style={styles.desc}>
        {product.description || "이 향수는 은은하고 고급스러운 분위기를 연출합니다."}
      </p>

      {/* 장바구니 */}
      <button style={styles.cartBtn}>장바구니에 담기 🛒</button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  backBtn: {
    position: "absolute",
    left: "20px",
    top: "20px",
    cursor: "pointer",
    fontSize: "18px",
    background: "none",
    border: "none",
  },
  image: {
    width: "300px",
    height: "300px",
    objectFit: "contain",
    marginBottom: "20px",
  },
  name: {
    fontSize: "32px",
    margin: "10px 0",
  },
  price: {
    fontSize: "24px",
    color: "#444",
  },
  desc: {
    fontSize: "18px",
    marginTop: "20px",
    lineHeight: "1.6",
    color: "#555",
  },
  cartBtn: {
    background: "black",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "30px",
    fontSize: "18px",
  },
};

export default ProductDetail;
