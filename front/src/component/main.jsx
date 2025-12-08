import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";
import Game from "./Game";
import ShootingGame from "./ShootingGame";



function Main() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState('');
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWish } = useWish();
    const [open, setOpen] = useState(false);
    const [p_name, setP_name] = useState("");
    const [p_price, setP_price] = useState("");
    const [p_category, setP_category] = useState("");

    //게임
    const [gameOpen, setGameOpen] = useState(false);
    const [shootOpen, setShootOpen] = useState(false);

    // 로그인 입력값
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const products = [
        { id: 1, img: "" },
        { id: 2, img: "" },
        { id: 3, img: "" },
        { id: 4, img: "image/gam.png" },
        { id: 5, img: "" },
        { id: 6, img: "image/jung1.jpg" },
    ];

    const visibleCount = 3;
    const cardWidth = 330;
    const gap = 20;

    // 자동 슬라이드
    useEffect(() => {
        const timer = setInterval(slideRight, 3000);
        return () => clearInterval(timer);
    }, []);

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

    async function product(){

        const userData = {
            name : p_name ,
            price : p_price ,
            category_id : p_category ,
        };

    const response = await fetch("http://192.168.0.224:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })

};

    // -------------------------
    // 🔥 로그인 함수(백엔드 연결)
    // -------------------------
    async function Login() {
        if (!userId || !password) {
            return alert("아이디와 비밀번호를 입력하세요!");
        }

        try {
            const res = await fetch("http://192.168.0.224:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: userId,
                    password: password
                })
            });

            const data = await res.json();
            console.log("로그인 응답:", data);

            if (!data.success) {
                return alert(data.message || "로그인 실패");
            }

            alert(`${data.user.name}님 환영합니다!`);

            // 로그인 성공 처리
            localStorage.setItem("login", "true");
            localStorage.setItem("user", JSON.stringify(data.user));

            setLogin(true);
            setLoginOpen(false);

            setUserId("");
            setPassword("");

        } catch (err) {
            console.error("로그인 오류:", err);
            alert("서버 오류 발생");
        }
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
                    </ul>
                </div>

                <div className="header-title">Aura</div>

                <div className="header-right">
                    <button className="open-btn" onClick={() => setOpen(true)}>상품 등록</button>

                    {open && (
                        <div className="popup-bg">
                            <div className="popup-box">
                                <button className="popup-close" onClick={() => setOpen(false)}>X</button>

                                <h3 className="popup-title">상품 목록</h3>
                                
                                <input 
                                className="popup-item" 
                                type="text"
                                 placeholder="상품명 입력"
                                 onChange={(e) => setP_name(e.target.value)} />

                                <input 
                                className="popup-item" 
                                type="text" 
                                placeholder="가격 입력" 
                                onChange={(e) => setP_price(e.target.value)} />

                                <input 
                                className="popup-item" 
                                type="text" 
                                placeholder="카테고리 입력" 
                                onChange={(e) => setP_category(e.target.value)} />

                                <input className="popup-item" type="file" placeholder="이미지 등록" />
                                <button className="popup-item" onClick={product}>상품 등록하기</button>
                            </div>
                        </div>
                    )}
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

                {/* 🔥 id + Password 입력 */}
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

                {gameOpen && (
                    <div className="game-overlay" onClick={() => setGameOpen(false)}>
                        <div className="game-popup" onClick={(e) => e.stopPropagation()}>
                            <Game />
                            <button onClick={() => setGameOpen(false)}>닫기</button>
                        </div>
                    </div>
                )}
                {shootOpen && (
                    <div className="game-overlay" onClick={() => setShootOpen(false)}>
                        <div className="game-popup" onClick={(e) => e.stopPropagation()}>
                            <ShootingGame />
                            <button onClick={() => setShootOpen(false)}>닫기</button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="footer">
                <button onClick={() => navigate("/service")}>🎧</button>
                <button>🤖</button>
                <button onClick={() => setGameOpen(true)}>🎮</button>
                <button onClick={() => setShootOpen(true)}>🎯</button>
            </footer>
        </div>
    );


}

export default Main;
