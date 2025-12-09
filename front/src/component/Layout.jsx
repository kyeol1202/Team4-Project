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

  const [open, setOpen] = useState(false);
  const [p_name, setP_name] = useState("");
  const [p_price, setP_price] = useState("");
  const [p_category, setP_category] = useState("");
  const [surcharge, setSurcharge] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    async function getCategory() {
      const res = await fetch("http://192.168.0.224:8080/api/category");
      const data = await res.json();
      if (data.success) setCategoryList(data.data);
    }
    getCategory();
  }, []);

  function search() {
    if (!surcharge.trim()) return alert("검색어를 입력하세요!");
    navigate(`/search?keyword=${surcharge}`);
  }

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
