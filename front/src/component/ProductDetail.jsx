import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";

const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { wishList, addToWish, removeFromWish } = useWish();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);

  // 상품 상세 불러오기
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);

          // 위시리스트 체크
          setIsInWish(
            wishList.some((item) => item.product_id === data.data.product_id)
          );
        }
      })
      .catch((err) => console.error("상품 상세 오류:", err));
  }, [id, wishList]);

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

  // 장바구니(DB 저장)
  const addToCartHandler = async () => {
  const userId = localStorage.getItem("member_id");
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

    if (data.success) {
      alert("장바구니에 담았습니다!");
    } else {
      alert(data.message);
    }
  } catch {
    alert("장바구니 오류");
  }
};

  // 스타일
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
    name: { fontSize: "34px", fontWeight: "600" },
    price: { fontSize: "22px", marginTop: "5px" },
    sectionBox: {
      marginTop: "35px",
      textAlign: "left",
      maxWidth: "600px",
      margin: "35px auto",
      padding: "20px",
      borderRadius: "10px",
      background: "#f7f7f7",
    },
    sectionTitle: { fontSize: "20px", fontWeight: "700" },
    desc: {
      fontSize: "16px",
      lineHeight: "1.7",
      color: "#333",
      whiteSpace: "pre-line",
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
      fontSize: "16px",
      cursor: "pointer",
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

  return (
    <div style={styles.container}>
      {/* 상품 이미지 */}
      <img
        src={`${API_URL}${product.img}`}
        alt={product.name}
        style={styles.image}
      />

      <h1 style={styles.name}>{product.name}</h1>
      <p style={styles.price}>{product.price?.toLocaleString()}원</p>

      {/* 설명 */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 설명</h2>
        <p style={styles.desc}>{product.description}</p>
      </div>

      {/* Notes */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향 구성</h2>
        <p><strong>Top:</strong> {product.top_notes || "정보 없음"}</p>
        <p><strong>Middle:</strong> {product.middle_notes || "정보 없음"}</p>
        <p><strong>Base:</strong> {product.base_notes || "정보 없음"}</p>
      </div>

      {/* 버튼 */}
      <div style={styles.btnGroup}>
        <button
          style={{
            ...styles.wishBtn,
            color: isInWish ? "red" : "#000",
          }}
          onClick={toggleWish}
        >
          {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
        </button>

        <button style={styles.cartBtn} onClick={addToCartHandler}>
          장바구니 담기 🛒
        </button>
      </div>

      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>
    </div>
  );
}

export default ProductDetail;
