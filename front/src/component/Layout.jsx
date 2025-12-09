import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";
import { useAuth } from "../context/AuthContext";
import Game from "../components/Game";

function Layout() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWish } = useWish();
  

  const [loginOpen, setLoginOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [surcharge, setSurcharge] = useState("");
  const [open, setOpen] = useState(false); // 상품 등록
  const [p_name, setP_name] = useState("");
  const [p_price, setP_price] = useState("");
  const [p_category, setP_category] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  // 카테고리 불러오기
  useEffect(() => {
    async function getCategory() {
      try {
        const res = await fetch("http://192.168.0.224:8080/api/category");
        const data = await res.json();
        if (data.success) setCategoryList(data.data);
      } catch (err) {
        console.error("카테고리 로딩 실패:", err);
      }
    }
    getCategory();
  }, []);

  // 상품 등록
  async function product() {
    if (!p_name || !p_price || !p_category) return alert("모든 항목을 입력하세요!");

    const userData = { name: p_name, price: Number(p_price), category_id: Number(p_category) };

    try {
      const response = await fetch("http://192.168.0.224:8080/api/productadd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (result.success) {
        alert("🎉 상품 등록 성공!");
        setOpen(false);
        setP_name("");
        setP_price("");
        setP_category("");
      } else {
        alert("❌ 상품 등록 실패: " + result.message);
      }
    } catch (err) {
      console.error("상품 등록 실패:", err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  }

  // 로그인
  async function Login() {
    if (!userId || !password) return alert("아이디와 비밀번호를 입력하세요!");
    try {
      const res = await fetch("http://192.168.0.224:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId, password }),
      });
      const data = await res.json();
      if (!data.success) return alert(data.message);

      login(data.user);
      alert(`${data.user.name}님 환영합니다!`);
      setLoginOpen(false);
      setUserId("");
      setPassword("");
    };
  }

  // 검색
  function search() {
    if (!surcharge.trim()) return alert("검색어를 입력하세요!");
    navigate(`/search?keyword=${surcharge}`);
  }

  // 마이페이지 버튼 클릭
  function handleMypageClick() {
    if (isLogin) navigate("/mypage");
    else setLoginOpen(true);
  }

  return (
    <>
      {/* HEADER */}
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
          <button onClick={() => (isLogin ? navigate("/wish") : setLoginOpen(true))}>♡</button>
          <button onClick={() => navigate("/cart")}>🛒</button>
          <button onClick={handleMypageClick}>👤</button>

          {/* 상품 등록 팝업 */}
          {open && (
            <div className="popup-bg">
              <div className="popup-box">
                <button className="popup-close" onClick={() => setOpen(false)}>X</button>
                <h3>상품 등록</h3>
                <input type="text" placeholder="상품명" value={p_name} onChange={(e) => setP_name(e.target.value)} />
                <input type="number" placeholder="가격" value={p_price} onChange={(e) => setP_price(e.target.value)} />
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
        </div>
      </header>

      {/* 로그인 drawer */}
      {loginOpen && <div className="overlay" onClick={() => setLoginOpen(false)}></div>}
      <div className={`login-drawer ${loginOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setLoginOpen(false)}>✕</button>
        <h2>Login</h2>
        <input type="text" placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login-btn" onClick={Login}>로그인</button>
        <button className="login-btn" onClick={() => navigate("/register")}>회원가입</button>
      </div>

      <Outlet />

      {/* 게임 팝업 */}
      {gameOpen && (
        <div className="game-overlay" onClick={() => setGameOpen(false)}>
          <div className="game-popup" onClick={(e) => e.stopPropagation()}>
            <Game />
            <button onClick={() => setGameOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <button onClick={() => navigate("/service")}>🎧</button>
        <button>🤖</button>
        <button onClick={() => setGameOpen(true)}>🎮</button>
      </footer>
    </>
  );
}

export default Layout;
