import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Category.css';

function Category() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState("");

    // 🔥 추가된 로그인 입력
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("login");
        if (saved === "true") setLogin(true);
    }, []);

    const [woman, setWoman] = useState([
        { product_id: 1, name: "AuRa Primevil", img: "/image/AuRa_Primeveil_woman.png" },
        { product_id: 2, name: "AuRa Elenique", img: "/image/AuRa_Elenique_woman.jpeg" },
        { product_id: 3, name: "AuRa Etherlune", img: "/image/AuRa_Etherlune_woman.png" },
    ]);

    const [man, setMan] = useState([
        { product_id: 5, name: "AuRa Silvaron", img: "/image/AuRa_Silvaron_man.png" },
        { product_id: 6, name: "AuRa Noctivale", img: "/image/AuRa_Noctivale_man.png" },
        { product_id: 7, name: "AuRa Solivane", img: "/image/AuRa_Solivane_man.jpeg" },
    ]);

    const slides = [woman, man];

    const slideRight = () => setIndex((prev) => (prev + 1) % slides.length);
    const slideLeft = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    function search() {
        if (!surcharge.trim()) return alert("검색어를 입력하세요!");
        navigate(`/search?keyword=${surcharge}`);
    }

    // 🔥 Main.jsx에서 가져온 로그인 함수
    async function Login() {
        if (!userId || !password) return alert("아이디와 비밀번호를 입력하세요!");

        try {
            const res = await fetch("http://192.168.0.224:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: userId, password })
            });

            const data = await res.json();

            if (!data.success) return alert(data.message || "로그인 실패");

            alert(`${data.user.name}님 환영합니다!`);

            localStorage.setItem("login", "true");
            localStorage.setItem("user", JSON.stringify(data.user));

            setLogin(true);
            setLoginOpen(false);

            setUserId("");
            setPassword("");
        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }
    }

    return (
        <div className="page">

            {/* HEADER */}
            <header className="header">
                <div className="header-left">
                    MENU
                    <ul className="dropdown">
                        <li className="dropdownlist" onClick={() => navigate("/category")}>베스트셀러</li>
                        <li className="dropdownlist" onClick={() => navigate("/category2")}>전체상품</li>
                        <li className="dropdownlist" onClick={() => navigate("/category3")}>남성향수</li>
                        <li className="dropdownlist" onClick={() => navigate("/category4")}>여성향수</li>
                    </ul>
                </div>

                <div className="header-title" onClick={() => navigate("/")}>Aura</div>

                <div className="header-right">
                    <button onClick={() => (login ? navigate("/wish") : setLoginOpen(true))}>♡</button>
                    <button onClick={() => navigate("/cart")}>🛒</button>
                    <button onClick={() => (login ? navigate("/mypage") : setLoginOpen(true))}>👤</button>
                </div>
            </header>

            {/* 검색창 */}
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

            {/* 제목 */}
            <h1 className="section-title">
                {index === 0 ? "WOMAN BEST SELLERS" : "MAN BEST SELLERS"}
            </h1>

            {/* 슬라이더 */}
            <div className="slider-wrapper">
                <span className="arrow left" onClick={slideLeft}>‹</span>

                <div className="slider">
                    <div
                        className="slider-inner"
                        style={{
                            transform: `translateX(-${index * 50}%)`,
                        }}
                    >

                        {/* WOMAN */}
                        <div className="slide-page">
                            {woman.map(item => (
                                <button
                                    className="product-card"
                                    key={item.product_id}
                                    onClick={() => navigate(`/product/${item.product_id}`)}
                                >
                                    <img src={item.img} alt={item.name} className="product-img" />
                                </button>
                            ))}
                        </div>

                        {/* MAN */}
                        <div className="slide-page">
                            {man.map(item => (
                                <button
                                    className="product-card"
                                    key={item.product_id}
                                    onClick={() => navigate(`/product/${item.product_id}`)}
                                >
                                    <img src={item.img} alt={item.name} className="product-img" />
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                <span className="arrow right" onClick={slideRight}>›</span>
            </div>

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

        </div>
    );
}

export default Category;
