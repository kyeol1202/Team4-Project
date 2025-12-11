import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";

const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishList, addToWish, removeFromWish } = useWish();

  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);

  const [reviewContent, setReviewContent] = useState("");
  const [reviewStar, setReviewStar] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  const userId = localStorage.getItem("member_id");

  /* ------------------------ 상품 상세 데이터 불러오기 ------------------------ */
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setEditData(data.data);
          setIsInWish(wishList.some(item => item.product_id === data.data.product_id));
        }
      })
      .catch(err => console.error("상품 상세 오류:", err));
  }, [id, wishList]);

  /* ------------------------ 구매 여부 체크 ------------------------ */
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHasPurchased(data.purchased);
      })
      .catch(err => console.error("구매 여부 체크 오류:", err));
  }, [userId, id]);


  /* ------------------------ 위시리스트 ------------------------ */
  const toggleWish = () => {
    if (isInWish) {
      removeFromWish(product.product_id);
      setIsInWish(false);
    } else {
      addToWish({ product_id: product.product_id });
      setIsInWish(true);
    }
  };

  /* ------------------------ 장바구니 ------------------------ */
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

  /* ------------------------ 수정 모드 ------------------------ */
  function toggleEdit() {
    setEditMode(true);
  }

  function handleChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function submitEdit() {
    const form = new FormData();
    Object.keys(editData).forEach(key => form.append(key, editData[key]));

    if (editData.imgFile) form.append("img", editData.imgFile);

    const res = await fetch(`${API_URL}/api/product-edit/${id}`, {
      method: "PUT",
      body: form,
    });

    const result = await res.json();

    if (result.success) {
      alert("상품이 수정되었습니다!");
      setProduct(editData);
      setEditMode(false);
    } else {
      alert("수정 실패");
    }
  }

  if (!product) return <div style={{ padding: 40 }}>Loading...</div>;


  /* ------------------------ 스타일 ------------------------ */
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
    backBtn: { marginTop: 40, fontSize: 17, color: "#444", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }
  };


  /* ------------------------ 렌더링 ------------------------ */
  return (
    <div style={styles.container}>

      {/* -------------------- 이미지 -------------------- */}
      <img src={`${API_URL}${product.img}`} alt={product.name} style={styles.image} />
      <div style={{ marginBottom: 20 }}></div>
      {/* -------------------- 상품명 / 수정 모드 -------------------- */}
      {editMode ? (
        <input
          name="name"
          value={editData.name}
          onChange={handleChange}
          style={{
        fontSize: 24,
        padding: 8,
        width: "400px",
        maxWidth: "90%",
        marginBottom: 15,
        display: "block", // 이름 input을 블록 요소로 (아래로 떨어지게)
        marginLeft: "auto",
        marginRight: "auto"
      }}
        />
      ) : (
        <h1 style={styles.name}>{product.name}</h1>
      )}

      {/* -------------------- 이미지 변경 -------------------- */}
      {editMode && (
        <input
          type="file"
          onChange={(e) => setEditData({ ...editData, imgFile: e.target.files[0] })}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* -------------------- 가격 -------------------- */}
      {editMode ? (
        <input
          name="price"
          value={editData.price}
          onChange={handleChange}
          style={{
        padding: 6,
        width: "200px",
        maxWidth: "90%",
        fontSize: 18,
        textAlign: "center",
        display: "block",  // 줄바꿈
        marginLeft: "auto",
        marginRight: "auto"
      }}
        />
      ) : (
        <p style={styles.price}>{product.price?.toLocaleString()}원</p>
      )}

      {/* -------------------- USER 버튼 -------------------- */}
      {(localStorage.getItem("role") === "USER") && (
        <>
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span style={{ margin: "0 8px" }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div style={styles.btnGroup}>
            <button style={{ ...styles.wishBtn, color: isInWish ? "red" : "#000" }} onClick={toggleWish}>
              {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
            </button>

            <button style={styles.cartBtn} onClick={addToCartHandler}>
              장바구니 담기 🛒
            </button>
          </div>
        </>
      )}

      {/* -------------------- 관리자: 수정 버튼 -------------------- */}
      {localStorage.getItem("role") === "ADMIN" && (
        !editMode ? (
          <button onClick={toggleEdit}>상품 수정</button>
        ) : (
          <button onClick={submitEdit}>저장하기</button>
        )
      )}

      {/* -------------------- 상세 설명 -------------------- */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 설명</h2>

        {editMode ? (
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            style={{ width: "100%", minHeight: 120 }}
          />
        ) : (
          <p style={styles.desc}>{product.description}</p>
        )}
      </div>

      {/* -------------------- 향 구성 -------------------- */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향 구성</h2>

        {["top_notes", "middle_notes", "base_notes"].map(note => (
          <p key={note}>
            <strong>{note.replace("_", " ").toUpperCase()}:</strong>{" "}
            {editMode ? (
              <input
                name={note}
                value={editData[note] || ""}
                onChange={handleChange}
                style={{ width: "70%" }}
              />
            ) : (
              product[note] || "정보 없음"
            )}
          </p>
        ))}
      </div>

      {/* -------------------- 스펙 -------------------- */}
      <div style={styles.sectionBox}>
        <h2 style={styles.sectionTitle}>향수 스펙</h2>

        {["perfume_type", "volume", "longevity", "sillage"].map(field => (
          <p key={field}>
            <strong>{field.toUpperCase()}:</strong>{" "}
            {editMode ? (
              <input
                name={field}
                value={editData[field] || ""}
                onChange={handleChange}
              />
            ) : (
              product[field]
            )}
          </p>
        ))}
      </div>

      {/* -------------------- 리뷰 섹션 -------------------- */}
      <div style={{ ...styles.sectionBox, textAlign: "center" }}>
        <h2 style={styles.sectionTitle}>고객 리뷰</h2>
        <p>구매 리뷰를 확인해보세요</p>

        {userId && hasPurchased ? (
          <>
            <h3 style={{ fontWeight: 600 }}>리뷰 작성</h3>

            <div style={{ marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onClick={() => setReviewStar(n)}
                  style={{
                    cursor: "pointer",
                    color: n <= reviewStar ? "gold" : "#ccc",
                    fontSize: 24,
                    marginRight: 3,
                  }}>
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="리뷰 내용을 입력하세요"
              style={{ width: "100%", padding: 10, minHeight: 80 }}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />

            <button onClick={() => alert("리뷰 등록 테스트 기능입니다.")}>
              작성
            </button>
          </>
        ) : (
          <p style={{ color: "red" }}>구매 고객만 리뷰를 작성할 수 있습니다.</p>
        )}
      </div>

      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;
