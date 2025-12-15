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
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isInWish, setIsInWish] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const userId = localStorage.getItem("member_id");

  /* =========================
     상품 데이터
  ========================= */
  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data);
          setEditData(data.data);
          setIsInWish(
            wishList.some(item => item.product_id === data.data.product_id)
          );
        }
      });
  }, [id, wishList]);

  /* =========================
     구매 여부 체크
  ========================= */
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/orders/${userId}/check/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHasPurchased(data.purchased);
      });
  }, [userId, id]);

  /* =========================
     카테고리
  ========================= */
  useEffect(() => {
    fetch(`${API_URL}/api/category`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategoryList(data.data);
      });
  }, []);

  /* =========================
     위시리스트
  ========================= */
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

  /* =========================
     장바구니
  ========================= */
  const addToCartHandler = async () => {
    if (!userId || userId === "null") {
      const key = "guest_cart";
      const cart = JSON.parse(localStorage.getItem(key) || "[]");

      const existing = cart.find(i => i.product_id === product.product_id);

      if (existing) existing.count += quantity;
      else {
        cart.push({
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          img: product.img,
          count: quantity,
        });
      }

      localStorage.setItem(key, JSON.stringify(cart));
      alert("장바구니에 담았습니다!");
      return;
    }

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
    alert(data.success ? "장바구니에 담았습니다!" : data.message);
  };

  /* =========================
     관리자 수정
  ========================= */
  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const submitEdit = async () => {
    const form = new FormData();
    Object.entries(editData).forEach(([key, value]) => {
      if (key !== "imgFile") form.append(key, value);
    });
    if (editData.imgFile) form.append("img", editData.imgFile);

    const res = await fetch(`${API_URL}/api/product-edit/${id}`, {
      method: "PUT",
      body: form,
    });

    const result = await res.json();
    if (result.success) {
      alert("상품 수정 완료");
      setProduct(result.data);
      setEditMode(false);
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  /* =========================
     렌더
  ========================= */
  return (
    <div className="Productstyles-container">
      <img
        className="Productstyles-image"
        src={`${API_URL}${product.img}`}
        alt={product.name}
      />

      <h1 className="Productstyles-name">{product.name}</h1>
      <p className="Productstyles-price">
        {product.price.toLocaleString()}원
      </p>

      {/* USER */}
      {(localStorage.getItem("role") === "USER" ||
        localStorage.getItem("role") === "null") && (
        <>
          <div className="qty-box">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <div className="Productstyles-btnGroup">
            <button
              className="Productstyles-wishBtn"
              style={{ color: isInWish ? "red" : "#000" }}
              onClick={toggleWish}
            >
              {isInWish ? "♥ 위시리스트" : "♡ 위시리스트"}
            </button>

            <button
              className="Productstyles-cartBtn"
              onClick={addToCartHandler}
            >
              장바구니 담기 🛒
            </button>
          </div>
        </>
      )}

      {/* 🔥 리뷰 섹션 (완전 분리) */}
      <ReviewSection
        productId={product.product_id}
        userId={userId}
      />

      <button
        className="Productstyles-backBtn"
        onClick={() => navigate(-1)}
      >
        ← 뒤로 돌아가기
      </button>
    </div>
  );
}

export default ProductDetail;
