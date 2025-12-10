import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
import { useCart } from "../context/CartContext";

// ⭐ API URL 통일
const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { wishList, addToWish, removeFromWish } = useWish();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
          setSelectedVolume(data.data.volume || "");

          // ⭐ 위시리스트 체크
          setIsInWish(
            wishList.some((item) => item.product_id === data.data.product_id)
          );

          // ⭐ 장바구니 체크 (CartContext 기준)
          setIsInCart(
            cart.some((item) => item.id === data.data.product_id)
          );
        }
      })
      .catch((err) => console.error("상품 상세 오류:", err));
  }, [id, wishList, cart]);

  if (!product) return <div style={{ padding: 40 }}>Loading...</div>;

  // ===========================
  // ⭐ 위시리스트 추가/삭제
  // ===========================
  const toggleWish = () => {
    if (isInWish) {
      removeFromWish(product.product_id);
      setIsInWish(false);
    } else {
      // WishContext는 product_id 기준
      addToWish({ product_id: product.product_id });
      setIsInWish(true);
    }
  };

  // ===========================
  // ⭐ 장바구니 추가 (프론트 & 백 둘 다 반영)
  // ===========================
  const addToCartHandler = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("로그인이 필요합니다!");
      return;
    }

    // 1️⃣ 프론트 장바구니(Context)에 먼저 담기
    addToCart({
      id: product.product_id,               // ⭐ CartContext는 id 기준
      name: product.name,
      price: product.price,
      img: `${API_URL}${product.img}`,      // 이미지 경로 완성
      volume: selectedVolume,
    });

    setIsInCart(true); // 버튼 비활성화용 상태

    // 2️⃣ 백엔드 장바구니에도 저장
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.product_id,
          count: quantity,
          volume: selectedVolume,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("장바구니에 담았습니다!");
      } else {
        // 이미 DB에 있을 수도 있지만, 프론트 장바구니에는 들어가 있으니 UI는 유지
        alert(data.message || "장바구니 추가 실패 (이미 있을 수 있음)");
      }
    } catch (err) {
      console.error("장바구니 오류:", err);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

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
    name: { fontSize: "34px", fontWeight: "600", letterSpacing: "1px" },
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
    sectionTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "10px" },
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
    optionBox: {
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    optionLabel: { fontSize: "16px", fontWeight: "500" },
    select: { padding: "6px 10px", fontSize: "16px" },
    quantityBox: { display: "flex", alignItems: "center", gap: "10px" },
    qtyBtn: { padding: "6px 12px", fontSize: "16px", cursor: "pointer" },
    qtyNumber: { fontSize: "16px", minWidth: "25px", textAlign: "center" },
  };

  return (
    <div style={styles.container}>
      {/* 이미지 */}
      <img
        src={`${API_URL}${product.img}`}
        alt={product.name}
        style={styles.image}
      />

      {/* 상품 기본 정보 */}
      <h1 style={styles.name}>{product.name}</h1>
      <p style={styles.price}>{product.price?.toLocaleString()}원</p>

      {/* 용량 선택 */}
      {product.volume_options && product.volume_options.length > 0 && (
        <div style={styles.optionBox}>
          <label style={styles.optionLabel}>용량 선택:</label>
          <select
            value={selectedVolume}
            onChange={(e) => setSelectedVolume(e.target.value)}
            style={styles.select}
          >
            {product.volume_options.map((vol) => (
              <option key={vol} value={vol}>
                {vol}mL
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 수량 선택 */}
      <div style={styles.optionBox}>
        <label style={styles.optionLabel}>수량:</label>
        <div style={styles.quantityBox}>
          <button
            onClick={() =>
              setQuantity(quantity > 1 ? quantity - 1 : 1)
            }
            style={styles.qtyBtn}
          >
            -
          </button>
          <span style={styles.qtyNumber}>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={styles.qtyBtn}
          >
            +
          </button>
        </div>
      </div>

      {/* 상세 설명 */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 설명</h2>
        <p style={styles.desc}>{product.description}</p>
      </div>

      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향 구성 (Notes)</h2>
        <p>
          <strong>Top Notes:</strong>{" "}
          {product.top_notes || "정보 없음"}
        </p>
        <p>
          <strong>Middle Notes:</strong>{" "}
          {product.middle_notes || "정보 없음"}
        </p>
        <p>
          <strong>Base Notes:</strong>{" "}
          {product.base_notes || "정보 없음"}
        </p>
      </div>

      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 스펙</h2>
        <p>
          <strong>타입:</strong>{" "}
          {product.perfume_type || "정보 없음"}
        </p>
        <p>
          <strong>용량:</strong>{" "}
          {product.volume || "정보 없음"}mL
        </p>
        <p>
          <strong>지속력 (Longevity):</strong>{" "}
          {product.longevity || "정보 없음"}/10
        </p>
        <p>
          <strong>잔향 (Sillage):</strong>{" "}
          {product.sillage || "정보 없음"}
        </p>
      </div>

      {/* 버튼 그룹 */}
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
        <button
          style={{
            ...styles.cartBtn,
            backgroundColor: isInCart ? "#555" : "#000",
            cursor: isInCart ? "not-allowed" : "pointer",
          }}
          onClick={addToCartHandler}
          disabled={isInCart}
        >
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

export default ProductDetail;
