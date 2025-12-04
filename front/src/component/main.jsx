import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState('');
    const navigate = useNavigate();

    const products = [
        { id: 1, img: "" },
        { id: 2, img: "" },
        { id: 3, img: "" },
        { id: 4, img: "image/gam2.jpeg" },
        { id: 5, img: "" },
        { id: 6, img: "image/gam" },
    ]; // 더미 상품 데이터

    const visibleCount = 3; // 화면에 보이는 카드 수11
    const cardWidth = 330;  // 카드 폭
    const gap = 20;         // 카드 간격


    // 자동 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            slideRight();
        }, 3000);
        return () => clearInterval(timer);
    }, [index]);

    useEffect(() => {
        const saved = localStorage.getItem("login");
        if (saved === "true") {
            setLogin(true);
        }
    }, []);

    const slideRight = () => {
        setIndex((prev) => {
            if (prev >= products.length - visibleCount) return 0;
            return prev + 1;
        });
    };

    const slideLeft = () => {
        setIndex((prev) => {
            if (prev === 0) return products.length - visibleCount;
            return prev - 1;
        });
    };

    function Login() {
        alert("로그인 되었습니다!");
        setLoginOpen(false);
        setLogin(true);
        localStorage.setItem("login", "true");   // 저장
    }

    function search() {
        if (!surcharge.trim()) return alert("검색어를 입력하세요!");

        navigate(`/search?keyword=${surcharge}`);
    }

    return (
        <div className="page">

            {/* HEADER */}
            <header className="header">
                <div className="header-left">
                    MENU
                    <ul className="dropdown">
                        <li className="dropdownlist" type="button" onClick={() => navigate("/category")}>베스트셀러</li>
                        <li className="dropdownlist" type="button" onClick={() => navigate("/category2")}>전체상품</li>
                        <li className="dropdownlist" type="button" onClick={() => navigate("/category3")}>남성향수</li>
                        <li className="dropdownlist" type="button" onClick={() => navigate("/category4")}>여성향수</li>
                        <li className="dropdownlist" type="button" onClick={() => navigate("/category5")}>향수 기프트 세트</li>
                    </ul>
                </div>

                <div className="header-title">Aura</div>

                <div className="header-right">

                    <button
                        onClick={() => {
                            if (login) {
                                navigate("/wish");
                            } else {

                                alert("로그인 후 이용 가능합니다.");
                                setLoginOpen(true);

                            }
                        }}
                    >
                        ♡
                    </button>

                    <button onClick={() => navigate("/cart")}>🛒</button>

                    <button
                        onClick={() => login ? navigate("/mypage") : setLoginOpen(true)}
                    >
                        👤
                    </button>
                </div>
            </header>


            {/* 검색창 */}
            <div className="search-box">
                <input type="text" placeholder="검색하기" value={surcharge} onChange={(e) => setSurcharge(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        search();
                    }
                }} /><button className="search" onClick={search}>🔍</button>
            </div>

            <h1 className="section-title">BEST SELLERS</h1>

            {/* --- 슬라이더 --- */}
            <div className="slider-wrapper">
                <span className="arrow left" onClick={slideLeft}>‹</span>

                <div className="slider">
                    <div
                        className="slider-inner"
                        style={{
                            transform: `translateX(-${index * (cardWidth + gap)}px)`
                        }}
                    >
                        {products.map((item) => (
                            <button key={item.id} className="product-card">
                                <img src={item.img} alt="" className="product-img" />
                            </button>
                        ))}
                    </div>
                </div>

                <span className="arrow right" onClick={slideRight}>›</span>
            </div>

            {loginOpen && <div className="overlay" onClick={() => setLoginOpen(false)}></div>}

            <div
                className={`login-drawer ${loginOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            ></div>

            <div className={`login-drawer ${loginOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setLoginOpen(false)}>
                    ✕
                </button>
                <h2>Login</h2>
                <input type="text" placeholder="ID" />
                <input type="password" placeholder="Password" />
                <button className="login-btn" onClick={Login}>로그인</button>
                <button className="login-btn" onClick={() => navigate("/register")}>회원가입</button>
            </div>  {/*로그인 관련*/}

            <footer className="footer">
                <button onClick={() => navigate("/service")}>🎧</button>
                <button>🤖</button>
            </footer>
        </div>


    );
}

export default Main;
