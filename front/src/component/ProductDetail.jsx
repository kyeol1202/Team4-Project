import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
import ReviewSection from "../component/ReviewSection";

const API_URL = "http://192.168.0.224:8080";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishList, addToWish, removeFromWish } = useWish();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);

  /* 관리자 수정 */
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  /* 리뷰 권한 */
  const [hasPurchased, setHasPurchased] = useState(false);

  const userId = localStorage.getItem("member_id");
  const role = localStorage.getItem("role");

  /* ================= 상품 조회 ================= */
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setEditData(data.data);
          setIsInWish(
            wishList.some(w => w.product_id === data.data.product_id)
          );
        }
      });
  }, [id, wishList]);

  /* ================= 구매 여부 ================= */
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHasPurchased(data.purchased);
      });
  }, [userId, id]);

  /* ================= 위시 ================= */
  const toggleWish = () => {
    if (!userId) return alert("로그인이 필요합니다.");

    if (isInWish) {
      removeFromWish(product.product_id);
      setIsInWish(false);
    } else {
      addToWish({ product_id: product.product_id });
      setIsInWish(true);
    }
  };

  /* ================= 장바구니 ================= */
  const addToCartHandler = async () => {
    if (!userId) return alert("로그인이 필요합니다.");

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
  };

  /* ================= 관리자 수정 ================= */
  const toggleEdit = () => setEditMode(true);
  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const submitEdit = async () => {
    const form = new FormData();
    Object.keys(editData).forEach(key => form.append(key, editData[key]));
    if (editData.imgFile) form.append("img", editData.imgFile);

    const res = await fetch(`${API_URL}/api/product-edit/${id}`, {
      method: "PUT",
      body: form,
    });

    const result = await res.json();
    if (result.success) {
      alert("상품 수정 완료");
      setProduct(editData);
      setEditMode(false);
    } else alert("수정 실패");
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="Productstyles-container">

      {/* ================= 이미지 ================= */}
      <img
        className="Productstyles-image"
        src={`${API_URL}${product.img}`}
        alt={product.name}
      />

      {/* ================= 상품명 / 가격 ================= */}
      {editMode ? (
        <input name="name" value={editData.name} onChange={handleChange} />
      ) : (
        <h1 className="Productstyles-name">{product.name}</h1>
      )}

      {editMode ? (
        <input name="price" value={editData.price} onChange={handleChange} />
      ) : (
        <p className="Productstyles-price">
          {product.price.toLocaleString()}원
        </p>
      )}

      {/* ================= USER UI ================= */}
      {role === "USER" && (
        <>
          <div className="qty-box">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <div className="Productstyles-btnGroup">
            <button onClick={toggleWish}>
              {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
            </button>
            <button onClick={addToCartHandler}>장바구니 담기</button>
          </div>
        </>
      )}

      {/* ================= 상품 설명 ================= */}
      <div className="Productstyles-sectionBox">
        <h2>향수 설명</h2>
        {editMode ? (
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
          />
        ) : (
          <p>{product.description}</p>
        )}
      </div>

      {/* ================= 향 구성 ================= */}
      <div className="Productstyles-sectionBox">
        <h2>향 구성</h2>

        {["top_notes", "middle_notes", "base_notes"].map(note => (
          <div key={note} className="Productstyles-row">
            <strong>{note.toUpperCase()}</strong>
            {editMode ? (
              <input
                name={note}
                value={editData[note] || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{product[note] || "정보 없음"}</span>
            )}
          </div>
        ))}
      </div>

      {/* ================= 스펙 ================= */}
      <div className="Productstyles-sectionBox">
        <h2>향수 스펙</h2>

        <div className="Productstyles-row">
          <strong>TYPE</strong>
          {editMode ? (
            <select
              name="perfume_type"
              value={editData.perfume_type || ""}
              onChange={handleChange}
            >
              <option value="">선택</option>
              <option value="EDP">EDP</option>
              <option value="EDT">EDT</option>
              <option value="EDC">EDC</option>
            </select>
          ) : (
            <span>{product.perfume_type}</span>
          )}
        </div>

        <div className="Productstyles-row">
          <strong>VOLUME</strong>
          {editMode ? (
            <input
              name="volume"
              value={editData.volume || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{product.volume} ml</span>
          )}
        </div>

        <div className="Productstyles-row">
          <strong>LONGEVITY</strong>
          {editMode ? (
            <input
              name="longevity"
              value={editData.longevity || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{product.longevity}</span>
          )}
        </div>

        <div className="Productstyles-row">
          <strong>SILLAGE</strong>
          {editMode ? (
            <select
              name="sillage"
              value={editData.sillage || ""}
              onChange={handleChange}
            >
              <option value="약함">약함</option>
              <option value="보통">보통</option>
              <option value="강함">강함</option>
            </select>
          ) : (
            <span>{product.sillage}</span>
          )}
        </div>
      </div>

      {/* ================= 관리자 저장 ================= */}
      {editMode && (
        <div className="save-btn-container">
          <label>
            이미지 변경
            <input
              type="file"
              onChange={(e) =>
                setEditData({ ...editData, imgFile: e.target.files[0] })
              }
            />
          </label>
          <button onClick={submitEdit}>저장</button>
        </div>
      )}

      {/* ================= 🔥 리뷰 (제일 하단 고정) ================= */}
      <ReviewSection
        productId={id}
        userId={userId}
        myPageMode={false}
        hasPurchased={hasPurchased}
      />

      <button className="Productstyles-backBtn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>
    </div>
  );
}

export default ProductDetail;
