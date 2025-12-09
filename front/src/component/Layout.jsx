import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";
import Game from "./Game";
import Game2 from "./Game2";


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
  const [p_img, setP_img] = useState(null);
  const [surcharge, setSurcharge] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [gameOpen, setGameOpen] = useState(false);
  const [gameOpen2, setGame2Open] = useState(false);

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
  const formData = new FormData();

  formData.append("name", p_name);
  formData.append("price", p_price);
  formData.append("category_id", p_category);
  formData.append("img", p_img);

  const response = await fetch("http://192.168.0.224:8080/api/productadd", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    alert("🎉 상품 등록 성공!");
    setOpen(false);
  } else {
    alert("❌ 등록 실패: " + result.message);
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

    // ⭐⭐⭐ 가장 중요한 추가된 1줄 (user_id 저장!) ⭐⭐⭐
    localStorage.setItem("user_id", data.user.member_id);

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

          {open && (
            <div className="popup-bg">
              <div className="popup-box">

                <button
                  className="popup-close"
                  onClick={() => setOpen(false)}
                >
                  X
                </button>

                <h3>상품 등록</h3>

                <input
                  type="text"
                  placeholder="상품명"
                  onChange={(e) => setP_name(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="가격"
                  onChange={(e) => setP_price(e.target.value)}
                />

                <select onChange={(e) => setP_category(e.target.value)}>
                  <option value="">카테고리 선택</option>

                  {categoryList.map((item) => (
                    <option
                      key={item.category_id}
                      value={item.category_id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setP_img(e.target.files[0])}
                />


                <button onClick={product}>등록하기</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 로그인 drawer */}
      {loginOpen && (
        <div className="overlay" onClick={() => setLoginOpen(false)}></div>
      )}

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

      {/* 페이지 내용 */}
      <Outlet />
      {gameOpen && (
        <div className="game-overlay" onClick={() => setGameOpen(false)}>
          <div className="game-popup" onClick={(e) => e.stopPropagation()}>
            <Game />
            <button onClick={() => setGameOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {gameOpen && (
        <div className="game-overlay" onClick={() => setGameOpen(false)}>
          <div className="game-popup" onClick={(e) => e.stopPropagation()}>
            <Game />
            <button onClick={() => setGameOpen(false)}>닫기</button>
          </div>
        </div>
      )}
      {gameOpen2 && (
        <div className="game-overlay" onClick={() => setGame2Open(false)}>
          <div className="game-popup" onClick={(e) => e.stopPropagation()}>
            <Game2 />
            <button onClick={() => setGame2Open(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <button onClick={() => navigate("/service")}>🎧</button>
        <button>🤖</button>
        <button onClick={() => setGameOpen(true)}>🎮</button>
        <button onClick={() => setGame2Open(true)}>🎮</button>
      </footer>
    </>
  );
}

export default Layout;
