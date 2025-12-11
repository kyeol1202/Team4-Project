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

  /* ------------------------ 상품 데이터 ------------------------ */
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setEditData(data.data);
          setIsInWish(wishList.some(item => item.product_id === data.data.product_id));
        }
      });
  }, [id, wishList]);

  /* ------------------------ 구매 여부 체크 ------------------------ */
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setHasPurchased(data.purchased); });
  }, [userId, id]);


  /* ------------------------ 위시 토글 ------------------------ */
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


  /* ------------------------ 수정 모드 ------------------------ */
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
      alert("상품 수정 완료!");
      setProduct(editData);
      setEditMode(false);
    } else alert("수정 실패");
  };


  if (!product) return <div className="loading">Loading...</div>;

  /* ------------------------ 렌더 ------------------------ */
  return (
    <div className="Productstyles-container">

      {/* 이미지 */}
      <img className="Productstyles-image" src={`${API_URL}${product.img}`} alt={product.name} />

      {/* 상품명 */}
      {editMode ? (
        <input
          className="Product_Name"
          name="name"
          value={editData.name}
          onChange={handleChange}
        />
      ) : (
        <h1 className="Productstyles-name">{product.name}</h1>
      )}

      {/* 이미지 업로드 */}
      {editMode && (
        <input type="file" onChange={(e) => setEditData({ ...editData, imgFile: e.target.files[0] })} />
      )}

      {/* 가격 */}
      {editMode ? (
        <input
          className="Product_Price"
          name="price"
          value={editData.price}
          onChange={handleChange}
        />
      ) : (
        <p className="Productstyles-price">{product.price.toLocaleString()}원</p>
      )}

      {/* USER UI */}
      {localStorage.getItem("role") === "USER" && (
        <>
          {/* 수량 */}
          <div className="qty-box">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          {/* 버튼들 */}
          <div className="Productstyles-btnGroup">
            <button
              className="Productstyles-wishBtn"
              style={{ color: isInWish ? "red" : "#000" }}
              onClick={toggleWish}
            >
              {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
            </button>

            <button className="Productstyles-cartBtn" onClick={addToCartHandler}>
              장바구니 담기 🛒
            </button>
          </div>
        </>
      )}

      {/* 관리자 수정 버튼 */}
      {localStorage.getItem("role") === "ADMIN" && (
        !editMode ?
          <button className="edit-btn" onClick={toggleEdit}>상품 수정</button>
          :
          <button className="edit-btn" onClick={submitEdit}>저장하기</button>
      )}

      {/* 상세 설명 */}
      <div className="Productstyles-sectionBox">
        <h2 className="Productstyles-sectionTitle">향수 설명</h2>

        {editMode ? (
          <textarea name="description" value={editData.description} onChange={handleChange} />
        ) : (
          <p className="Productstyles-desc">{product.description}</p>
        )}
      </div>

      {/* 향 구성 */}
      <div className="Productstyles-sectionBox">
        <h2 className="Productstyles-sectionTitle">향 구성</h2>

        {["top_notes", "middle_notes", "base_notes"].map(note => (
          <p key={note}>
            <strong>{note.toUpperCase()}:</strong>{" "}
            {editMode ? (
              <input
                name={note}
                value={editData[note] || ""}
                onChange={handleChange}
              />
            ) : (
              product[note] || "정보 없음"
            )}
          </p>
        ))}
      </div>

      {/* 스펙 */}
      <div className="Productstyles-sectionBox">
        <h2 className="Productstyles-sectionTitle">향수 스펙</h2>

        {["perfume_type", "volume", "longevity", "sillage"].map(field => (
          <p key={field}>
            <strong>{field.toUpperCase()}:</strong>{" "}
            {editMode ? (
              <input name={field} value={editData[field] || ""} onChange={handleChange} />
            ) : (
              product[field]
            )}
          </p>
        ))}
      </div>

      {/* 리뷰 */}
      <div className="Productstyles-sectionBox review-box">
        <h2 className="Productstyles-sectionTitle">고객 리뷰</h2>

        {userId && hasPurchased ? (
          <>
            <h3>리뷰 작성</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onClick={() => setReviewStar(n)}
                  style={{ color: n <= reviewStar ? "gold" : "#ccc" }}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />

            <button onClick={() => alert("리뷰 저장 테스트")}>작성</button>
          </>
        ) : (
          <p style={{ color: "red" }}>구매 고객만 리뷰를 작성할 수 있습니다.</p>
        )}
      </div>

      <button className="Productstyles-backBtn" onClick={() => navigate(-1)}>
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;
