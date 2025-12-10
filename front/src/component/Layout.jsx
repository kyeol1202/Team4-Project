import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

  // ---------------- 상품 등록 변수 ----------------
  const [open, setOpen] = useState(false);
  const [p_name, setP_name] = useState("");
  const [p_price, setP_price] = useState("");
  const [p_description, setP_description] = useState("");
  const [p_top_notes, setP_top_notes] = useState("");
  const [p_middle_notes, setP_middle_notes] = useState("");
  const [p_base, setP_base] = useState("");
  const [p_volume, setP_volume] = useState("");
  const [p_gender, setP_gender] = useState("");
  const [p_perfume_type, setP_perfume_type] = useState("");
  const [p_longevity, setP_longevity] = useState("");
  const [p_sillage, setP_sillage] = useState("");
  const [p_category, setP_category] = useState("");
  const [p_img, setP_img] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : "GUEST";
  // ---------------- 게임 변수 ----------------
  const [gameOpen, setGameOpen] = useState(false);
  const [gameOpen2, setGame2Open] = useState(false);

  // 로그인 정보 유지
  useEffect(() => {
    const saved = localStorage.getItem("login");
    setLogin(saved === "true");
  }, []);

  // 카테고리 목록 가져오기 (DB)
  useEffect(() => {
    async function getCategory() {
      const res = await fetch("http://192.168.0.224:8080/api/category");
      const data = await res.json();
      if (data.success) setCategoryList(data.data);
    }
    getCategory();
  }, []);


  // ---------------- 상품 등록 ----------------
  async function product() {
    const formData = new FormData();

    formData.append("name", p_name);
    formData.append("price", p_price);
    formData.append("description", p_description);
    formData.append("top_notes", p_top_notes);
    formData.append("middle_notes", p_middle_notes);
    formData.append("base", p_base);
    formData.append("volume", p_volume);
    formData.append("gender", p_gender);
    formData.append("perfume_type", p_perfume_type);
    formData.append("longevity", p_longevity);
    formData.append("sillage", p_sillage);
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

  // ---------------- 로그인 ----------------
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

    setRole = localStorage.getItem("role");

  }


  function search() {
    if (!surcharge.trim()) return alert("검색어를 입력하세요!");
    navigate(`/search?keyword=${surcharge}`);
  }

  const [surcharge, setSurcharge] = useState("");


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
          {role === "ADMIN" && (
          <button onClick={() => setOpen(true)}>상품 등록</button>
          )}


          {role === "USER" && "null" (
            <>
          <button onClick={() => login ? navigate("/wish") : setLoginOpen(true)}>♡</button>
          <button onClick={() => navigate("/cart")}>🛒</button>
            </>
          )}
          <button onClick={() => login ? navigate("/mypage") : setLoginOpen(true)}>👤</button>



          {/* 상품 등록 팝업 */}
          {open && (

            <>
              {/* 바탕 클릭하면 닫힘 */}
              <div className="overlay" onClick={() => setOpen(false)}>

              <div className="popup-bg">


                <div className="popup-box perfume-popup">

                  <button className="popup-close" onClick={() => setOpen(false)}>×</button>

                  <h3 className="popup-title">✨ 상품 등록</h3>

                  <div className="popup-form">

                    <label>상품명</label>
                    <input type="text" onChange={(e) => setP_name(e.target.value)} />

                    <label>상품 설명</label>
                    <textarea onChange={(e) => setP_description(e.target.value)} />

                    <label>탑 노트</label>
                    <input type="text" onChange={(e) => setP_top_notes(e.target.value)} />

                    <label>미들 노트</label>
                    <input type="text" onChange={(e) => setP_middle_notes(e.target.value)} />

                    <label>베이스 노트</label>
                    <input type="text" onChange={(e) => setP_base(e.target.value)} />

                    <label>용량(ml)</label>
                    <input type="number" onChange={(e) => setP_volume(e.target.value)} />

                    <label>성별</label>
                    <select onChange={(e) => setP_gender(e.target.value)}>
                      <option value="">선택</option>
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                      <option value="유니섹스">유니섹스</option>
                    </select>

                    <label>향수 종류</label>
                    <select onChange={(e) => setP_perfume_type(e.target.value)}>
                      <option value="">선택</option>
                      <option value="EDP">EDP</option>
                      <option value="EDT">EDT</option>
                      <option value="EDC">EDC</option>
                    </select>

                    <label>지속력(1~10)</label>
                    <select onChange={(e) => setP_longevity(e.target.value)}>
                      <option value="">선택</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>

                    <label>잔향</label>
                    <select onChange={(e) => setP_sillage(e.target.value)}>
                      <option value="">선택</option>
                      <option value="약함">약함</option>
                      <option value="보통">보통</option>
                      <option value="강함">강함</option>
                    </select>

                    <label>가격</label>
                    <input type="number" onChange={(e) => setP_price(e.target.value)} />

                    <label>카테고리</label>
                    <select onChange={(e) => setP_category(e.target.value)}>
                      <option value="">선택</option>
                      {categoryList.map((item) => (
                        <option key={item.category_id} value={item.category_id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <label>상품 이미지</label>
                    <input type="file" accept="image/*" onChange={(e) => setP_img(e.target.files[0])} />

                    <button className="btn-submit" onClick={product}>등록하기</button>
                  </div>
                </div>
              </div>
              </div>
            </>
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

        <input type="text" placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="login-btn" onClick={Login}>로그인</button>
        <button className="login-btn" onClick={() => { navigate("/register"); setLoginOpen(false); }}>회원가입</button>
      </div>


      <Outlet />

      {/* FOOTER 게임 */}
      <footer className="footer">
        <button onClick={() => navigate("/service")}>🎧</button>
        <button>🤖</button>
        <button onClick={() => setGameOpen(true)}>🎮</button>
        <button onClick={() => setGame2Open(true)}>🎮</button>
      </footer>

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
    </>
  );
}

export default Layout;
