import { useEffect, useState } from "react";
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

  // 관리자 수정 모드
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // 리뷰 관련
  const [reviewContent, setReviewContent] = useState("");
  const [reviewStar, setReviewStar] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);

  const userId = localStorage.getItem("member_id");
  const role = localStorage.getItem("role");

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

  /* ------------------------ 전체 리뷰 조회 ------------------------ */
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews?product_id=${id}`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error("리뷰 로드 실패:", err);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [id]);

  /* ------------------------ 리뷰 작성 ------------------------ */
  const submitReview = async () => {
    if (!reviewContent.trim()) return alert("리뷰 내용을 입력하세요.");
    if (!reviewStar) return alert("별점을 선택하세요.");

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: id,
          content: reviewContent,
          star: reviewStar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewContent("");
        setReviewStar(0);
        fetchReviews(); // 작성 후 전체 리뷰 갱신
      } else alert("리뷰 작성 실패");
    } catch (err) {
      console.error(err);
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

  /* ------------------------ 위시 토글 ------------------------ */
  const toggleWish = () => {

    if (!userId) return alert("로그인이 필요합니다!");

    else{


    
    if (isInWish) {
      removeFromWish(product.product_id);
      setIsInWish(false);
    } else {
      addToWish({ product_id: product.product_id });
      setIsInWish(true);
    }
  }
  };

  /* ------------------------ 관리자 상품 수정 ------------------------ */
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

  return (
    <div className="Productstyles-container">
      {/* 이미지 */}
      <img src={`${API_URL}${product.img}`} alt={product.name} />
      {/* 상품명 */}
      {editMode ? (
        <input name="name" value={editData.name} onChange={handleChange} />
      ) : <h1>{product.name}</h1>}
      {/* 가격 */}
      {editMode ? (
        <input name="price" value={editData.price} onChange={handleChange} />
      ) : <p>{product.price.toLocaleString()}원</p>}

      {/* USER UI */}
      {role === "USER" && (
        <>
          <div className="qty-box">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button onClick={toggleWish}>
            {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
          </button>
          <button onClick={addToCartHandler}>장바구니 담기</button>
        </>
      )}

      {/* 관리자 수정 버튼 */}
      {role === "ADMIN" && !editMode && (
        <button onClick={toggleEdit}>상품 수정</button>
      )}
      {editMode && (
        <>
          <label>
            이미지 변경
            <input type="file" onChange={(e) => setEditData({...editData, imgFile: e.target.files[0]})}/>
          </label>
          <button onClick={submitEdit}>저장</button>
        </>
      )}

      {/* 리뷰 */}
      {role === "USER" && (
        <div className="review-box">
          <h2>고객 리뷰</h2>
          {userId && hasPurchased && (
            <>
              <div className="stars">
                {[1,2,3,4,5].map(n => (
                  <span
                    key={n}
                    onClick={() => setReviewStar(n)}
                    style={{ color: n <= reviewStar ? "gold" : "#ccc", cursor: "pointer" }}
                  >★</span>
                ))}
              </div>
              <textarea
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                placeholder="리뷰 작성"
              />
              <button onClick={submitReview}>작성</button>
            </>
          )}
          <h3>작성된 리뷰</h3>
          <ul>
            {reviews.length === 0 ? <li>리뷰가 없습니다.</li> :
              reviews.map(r => (
                <li key={r.id}>
                  <strong>{r.user_name || "익명"}</strong> ({r.star}★)
                  <p>{r.content}</p>
                </li>
              ))
            }
          </ul>
        </div>
      )}

      <button onClick={() => navigate(-1)}>← 뒤로가기</button>
    </div>
  );
}

export default ProductDetail;
