import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Category() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState("");
    const navigate = useNavigate();

    // 저장되어 있던 로그인 상태 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("login");
        if (saved === "true") setLogin(true);
    }, []);

    // ⭐⭐⭐ 여자향수 BEST 3
    const woman = [
        { id: 1, img: "/img/w1.jpg" },
        { id: 2, img: "/img/w2.jpg" },
        { id: 3, img: "/img/w3.jpg" }
    ];

    // ⭐⭐⭐ 남자향수 BEST 3
    const man = [
        { id: 4, img: "/img/m1.jpg" },
        { id: 5, img: "/img/m2.jpg" },
        { id: 6, img: "/img/m3.jpg" }
    ];

    // ⭐⭐⭐ 슬라이드 2개: 0 = 여자, 1 = 남자
    const slides = [woman, man];

    // 슬라이드 이동
    const slideRight = () => setIndex((prev) => (prev + 1) % slides.length);
    const slideLeft = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    function search() {
        if (!surcharge.trim()) return alert("검색어를 입력하세요!");
        navigate(`/search?keyword=${surcharge}`);
    }

    return (
        <div className="page">

            {/* HEADER 동일 */}
            <header className="header">
                <div className="header-left">
                    MENU
                    <ul className="dropdown">
                        <li className="dropdownlist" onClick={() => navigate("/category")}>베스트셀러</li>
                        <li className="dropdownlist" onClick={() => navigate("/category2")}>전체상품</li>
                        <li className="dropdownlist" onClick={() => navigate("/category3")}>남성향수</li>
                        <li className="dropdownlist" onClick={() => navigate("/category4")}>여성향수</li>
                        <li className="dropdownlist" onClick={() => navigate("/category5")}>향수 기프트 세트</li>
                    </ul>
                </div>

                <div className="header-title">Aura</div>

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
                />
                <button className="search" onClick={search}>🔍</button>
            </div>

            {/* 현재 페이지 제목 */}
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
                            transform: `translateX(-${index * 100}%)`
                        }}
                    >
                        {/* 여자 페이지 */}
                        <div className="slide">
                            {woman.map((item) => (
                                <button className="product-card" key={item.id}>
                                    <img src={item.img} alt="" className="product-img" />
                                </button>
                            ))}
                        </div>

                        {/* 남자 페이지 */}
                        <div className="slide">
                            {man.map((item) => (
                                <button className="product-card" key={item.id}>
                                    <img src={item.img} alt="" className="product-img" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <span className="arrow right" onClick={slideRight}>›</span>

            </div>

            {loginOpen && <div className="overlay" onClick={() => setLoginOpen(false)}></div>}
        </div>
    );
}

export default Category;
