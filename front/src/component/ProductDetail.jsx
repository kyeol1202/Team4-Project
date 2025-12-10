import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
// import useCart from "../hooks/useCart";


// ⭐ API URL 통일

const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishList, addToWish, removeFromWish } = useWish();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);

  // 리뷰 작성
  const [reviewContent, setReviewContent] = useState("");
  const [reviewStar, setReviewStar] = useState(0);

  // 구매 여부 체크 (UI용)
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

  // 구매 여부 확인 (UI용, 실제 연동은 서버 API 필요)
  useEffect(() => {
    // 예시: 구매 여부를 서버에서 가져오는 API 호출
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

  // 리뷰 작성 (UI용)
  const submitReview = () => {
    if (!reviewContent.trim()) return alert("리뷰 내용을 입력하세요");
    alert(`리뷰 등록! 별점: ${reviewStar} 내용: ${reviewContent}`);
    setReviewContent("");
    setReviewStar(0);
  };

  const styles = {
    container: { padding: 40, fontFamily: "'Noto Sans KR', sans-serif", color: "#000", textAlign: "center" },
    image: { width: 320, height: 320, objectFit: "contain", marginBottom: 30 },
    name: { fontSize: 34, fontWeight: 600 },
    price: { fontSize: 22, marginTop: 5 },
    sectionBox: { marginTop: 35, textAlign: "left", maxWidth: 600, margin: "35px auto", padding: 20, borderRadius: 10, background: "#f7f7f7" },
    sectionTitle: { fontSize: 20, fontWeight: 700 },
    desc: { fontSize: 16, lineHeight: 1.7, color: "#333", whiteSpace: "pre-line" },
    btnGroup: { marginTop: 30, display: "flex", justifyContent: "center", gap: 15 },
    wishBtn: { border: "1px solid #aaa", padding: "10px 20px", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 16 },
    cartBtn: { background: "black", color: "white", padding: "10px 22px", borderRadius: 8, border: "none", fontSize: 16, cursor: "pointer" },
    backBtn: { marginTop: 40, fontSize: 17, color: "#444", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      {/* 상품 이미지 */}
      <img src={`${API_URL}${product.img}`} alt={product.name} style={styles.image} />
      <h1 style={styles.name}>{product.name}</h1>
      <p style={styles.price}>{product.price?.toLocaleString()}원</p>

      {/* 수량 선택 */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
        <span style={{ margin: "0 8px" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      {/* 버튼 그룹 */}
      <div style={styles.btnGroup}>
        <button style={{ ...styles.wishBtn, color: isInWish ? "red" : "#000" }} onClick={toggleWish}>
          {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
        </button>
        <button style={styles.cartBtn} onClick={addToCartHandler}>
          장바구니 담기 🛒
        </button>
      </div>

      {/* 상품 상세 */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 설명</h2>
        <p style={styles.desc}>{product.description}</p>
      </div>
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향 구성</h2>
        <p><strong>Top:</strong> {product.top_notes || "정보 없음"}</p>
        <p><strong>Middle:</strong> {product.middle_notes || "정보 없음"}</p>
        <p><strong>Base:</strong> {product.base_notes || "정보 없음"}</p>
      </div>
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 스펙</h2>
        <p><strong>타입:</strong> {product.perfume_type || "정보 없음"}</p>
        <p><strong>용량:</strong> {product.volume || "정보 없음"}mL</p>
        <p><strong>지속력:</strong> {product.longevity || "정보 없음"}/10</p>
        <p><strong>잔향:</strong> {product.sillage || "정보 없음"}</p>
      </div>

      {/* 리뷰 섹션 */}
      <div style={{ ...styles.sectionBox, textAlign: "center" }}>
        <h2 style={styles.sectionTitle}>고객 리뷰</h2>
        <p>구매 리뷰를 확인해보세요</p>
        <small>개인정보 처리방침</small>

        {userId && hasPurchased ? (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <h3 style={{ fontWeight: 600 }}>리뷰 작성</h3>

            {/* 별점 선택 */}
            <div style={{ marginBottom: 10 }}>
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  onClick={() => setReviewStar(n)}
                  style={{
                    cursor: "pointer",
                    color: n <= reviewStar ? "gold" : "#ccc",
                    fontSize: 24,
                    marginRight: 3,
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="리뷰 내용을 입력하세요"
              style={{ width: "100%", padding: 10, borderRadius: 5, border: "1px solid #ccc", minHeight: 80 }}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />

            <div style={{ marginTop: 10, textAlign: "center" }}>
              <button
                onClick={submitReview}
                style={{ padding: "8px 16px", borderRadius: 5, border: "none", background: "#000", color: "#fff", cursor: "pointer" }}
              >
                작성
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: "#f00", marginTop: 10 }}>
            리뷰 작성은 구매 고객만 가능합니다. 로그인 후 구매 내역이 있어야 작성할 수 있습니다.
          </p>
        )}
      </div>

      {/* 뒤로가기 */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;
