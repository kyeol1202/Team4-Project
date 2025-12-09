import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWish } = useWish();
  const { isLogin, logout } = useAuth();

  const [open, setOpen] = useState(false); // 상품 등록 팝업
  const [p_name, setP_name] = useState("");
  const [p_price, setP_price] = useState("");
  const [p_category, setP_category] = useState("");
  const [surcharge, setSurcharge] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  // 카테고리 불러오기
  useEffect(() => {
    async function getCategory() {
      try {
        const res = await fetch("http://192.168.0.224:8080/api/category");
        const data = await res.json();
        if (data.success) setCategoryList(data.data);
      } catch (err) {
        console.error("카테고리 불러오기 실패:", err);
      }
    }
    getCategory();
  }, []);

  // 검색
  const search = () => {
    if (!surcharge.trim()) return alert("검색어를 입력하세요!");
    navigate(`/search?keyword=${surcharge}`);
  };

  // 상품 등록
  const product = async () => {
    if (!p_name || !p_price || !p_category) return alert("모든 항목을 입력하세요!");
    try {
      const res = await fetch("http://192.168.0.224:8080/api/productadd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p_name,
          price: p_price,
          category_id: p_category,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert("🎉 상품 등록 성공!");
        setOpen(false);
        setP_name(""); setP_price(""); setP_category("");
      } else {
        alert("❌ 상품 등록 실패: " + result.message);
      }
    } catch (err) {
      console.error("상품 등록 오류:", err);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          MENU
          <ul className="dropdown">
            <li onClick={() => navigate("/category2")}>전체상품</li>
            <li onClick={() => navigate("/category3")}>여성향수</li>
            <li onClick={() => navigate("/category4")}>남성향수</li>
          </ul>
        </div>

        <div className="header-title" onClick={() => navigate("/")}>Aura</div>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="검색하기"
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button className="search" onClick={search}>🔍</button>
          </div>

          <button onClick={() => setOpen(true)}>상품 등록</button>
          <button onClick={() => isLogin ? navigate("/wish") : navigate("/login")}>♡</button>
          <button onClick={() => navigate("/cart")}>🛒</button>
          <button onClick={() => isLogin ? navigate("/mypage") : navigate("/login")}>👤</button>
          <button onClick={isLogin ? logout : () => navigate("/login")}>
            {isLogin ? "로그아웃" : "로그인"}
          </button>
        </div>
      </header>

      {/* 상품 등록 팝업 */}
      {open && (
        <div className="popup-bg">
          <div className="popup-box">
            <button className="popup-close" onClick={() => setOpen(false)}>X</button>
            <h3>상품 등록</h3>

            <input
              type="text"
              placeholder="상품명"
              value={p_name}
              onChange={(e) => setP_name(e.target.value)}
            />
            <input
              type="text"
              placeholder="가격"
              value={p_price}
              onChange={(e) => setP_price(e.target.value)}
            />
            <select value={p_category} onChange={(e) => setP_category(e.target.value)}>
              <option value="">카테고리 선택</option>
              {categoryList.map((item) => (
                <option key={item.category_id} value={item.category_id}>{item.name}</option>
              ))}
            </select>
            <button onClick={product}>등록하기</button>
          </div>
        </div>
      )}

      <Outlet />

      <footer className="footer">
        <button onClick={() => navigate("/service")}>🎧</button>
        <button>🤖</button>
        <button>🎮</button>
        <button>🎯</button>
      </footer>
    </>
  );
}

export default Layout;
