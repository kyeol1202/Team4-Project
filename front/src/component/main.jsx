import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState('');
    const navigate = useNavigate();

    // 로그인 입력값
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const products = [
        { id: 1, img: "" },
        { id: 2, img: "" },
        { id: 3, img: "" },
        { id: 4, img: "image/gam2.jpeg" },
        { id: 5, img: "" },
        { id: 6, img: "image/gam" },
    ];

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');


    const products = ["제품 1", "제품 2", "제품 3", "제품 4", "제품 5", "제품 6"];

    const visibleCount = 3;
    const cardWidth = 330;
    const gap = 20;

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

    function login() {


    }

    return (
        <div className="page">

            {/* HEADER */}
            <header className="header">
                <div className="header-left">
                    MENU
                    <ul className="dropdown">
                        <li className="dropdownlist" type="button">베스트셀러</li>
                        <li className="dropdownlist" type="button">전체상품</li>
                        <li className="dropdownlist" type="button">남성향수</li>
                        <li className="dropdownlist" type="button">여성향수</li>
                        <li className="dropdownlist" type="button">향수 기프트 세트</li>
                    </ul>
                </div>

                <div className="header-title">AuRa</div>

                <div className="header-right">
                    <button
                        onClick={() => {
                            if (login) navigate("/wish");
                            else {
                                alert("로그인 후 이용 가능합니다.");
                                setLoginOpen(true);
                            }
                        }}
                    >
                        ♡
                    </button>

                    <button onClick={() => navigate("/cart")}>🛒</button>

                    <button onClick={() => (login ? navigate("/mypage") : setLoginOpen(true))}>
                        👤
                    </button>
                </div>
            </header>

            {/* 검색창 */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="검색하기"
                    value={surcharge}
                    onChange={(e) => setSurcharge(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") search();
                    }}
                />
                <button className="search" onClick={search}>🔍</button>
            </div>

            <h1 className="section-title">BEST SELLERS</h1>

            {/* 슬라이더 */}
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

            <div className={`login-drawer ${loginOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setLoginOpen(false)}>
                    ✕
                </button>
                <h2>Login</h2>
                <input type="text" placeholder="ID" />
                <input type="password" placeholder="Password" />
                <button className="login-btn">로그인</button>
            </div>

            <footer className="footer">
                <button onClick={() => navigate("/service")}>🎧</button>
                <button>🤖</button>
            </footer>
        </div>
    );
}

export default Main;
