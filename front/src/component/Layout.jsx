import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";

function Layout() {

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWish } = useWish();

  const [login, setLogin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [open, setOpen] = useState(false); // 상품등록 팝업
  const [p_name, setP_name] = useState("");
  const [p_price, setP_price] = useState("");
  const [p_category, setP_category] = useState("");
      const [surcharge, setSurcharge] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  // 로그인 상태 가져오기
  useEffect(() => {
    const saved = localStorage.getItem("login");
    if (saved === "true") setLogin(true);
  }, []);

  // 카테고리 불러오기
  useEffect(() => {
    async function getCategory() {
      const res = await fetch("http://192.168.0.224:8080/api/category");
      const data = await res.json();
      if (data.success) setCategoryList(data.data);
    }
    getCategory();
  }, []);

  // 상품 등록
  async function product() {
    const userData = {
      name: p_name,
      price: p_price,
      category_id: p_category,
    };

    const response = await fetch("http://192.168.0.224:8080/api/productadd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })

    const result = await response.json();
    if (result.success) {
      alert("🎉 상품 등록 성공!");
      setOpen(false);
    } else {
      alert("❌ 상품 등록 실패: " + result.message);
    }
  }

  // 로그인
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  async function Login() {
    if (!userId || !password) return alert("아이디와 비밀번호를 입력하세요!");

    const res = await fetch("http://192.168.0.224:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userId,
        password: password
      })
    });

    const data = await res.json();

    if (!data.success) return alert(data.message);

    alert(`${data.user.name}님 환영합니다!`);
    localStorage.setItem("login", "true");
    localStorage.setItem("user", JSON.stringify(data.user));

    setLogin(true);
    setLoginOpen(false);
    setUserId("");
    setPassword("");
  }
  function search() {
        if (!surcharge.trim()) return alert("검색어를 입력하세요!");
        navigate(`/search?keyword=${surcharge}`);
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

  <div className="header-title" onClick={() => navigate("/")}>
    Aura
  </div>

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
    <button onClick={() => login ? navigate("/wish") : setLoginOpen(true)}>♡</button>
    <button onClick={() => navigate("/cart")}>🛒</button>
    <button onClick={() => login ? navigate("/mypage") : setLoginOpen(true)}>👤</button>

  </div>
</header>

      {/* 로그인 drawer */} 
      {/* 🔥 로그인 배경 */}
            {loginOpen && (
                <div className="overlay" onClick={() => setLoginOpen(false)}></div>
            )}

            {/* 🔥 로그인 drawer */}
            <div className={`login-drawer ${loginOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setLoginOpen(false)}>✕</button>
                <h2>Login</h2>

                <input
                    type="text"
                    placeholder="ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login-btn" onClick={Login}>로그인</button>
                <button className="login-btn" onClick={() => navigate("/register")}>회원가입</button>
            </div>

      {/* 페이지 내용 바뀌는 부분 */}
      <Outlet />

      {/* FOOTER */}
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
