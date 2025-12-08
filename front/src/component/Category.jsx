import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



function Category() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("login");
        if (saved === "true") setLogin(true);
    }, []);

    // ============================
    // 🔥 테스트용 이미지 데이터 (베스트 3개씩)
    // ============================
    const [woman, setWoman] = useState([
        { product_id: 1, name: "AuRa Primeveil", img: "/image/jumg2.jpg" },
        { product_id: 2, name: "AuRa Elenique", img: "/image/per2.jpeg" },
        { product_id: 3, name: "AuRa Vorelle", img: "/image/per3.jpeg" },
    ]);

    const [man, setMan] = useState([
        { product_id: 5, name: "AuRa Noctivale", img: "/image/jung1.jpg" },
        { product_id: 6, name: "AuRa Solivane", img: "/image/per6.jpeg" },
        { product_id: 7, name: "AuRa Freesia", img: "/image/per7.jpeg" },
    ]);

    // ============================
    // 🔥 DB 연동이 필요하면 아래 주석 해제
    // ============================
    // useEffect(() => {
    //     fetch("http://192.168.0.224:8080/api/products/woman")
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) setWoman(data.data);
    //         });

    //     fetch("http://192.168.0.224:8080/api/products/man")
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) setMan(data.data);
    //         });
    // }, []);

    // 페이지 2개 (여자 / 남자)
    const slides = [woman, man];

    const slideRight = () => setIndex((prev) => (prev + 1) % slides.length);
    const slideLeft = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

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
                        <li className="dropdownlist" onClick={() => navigate("/category")}>베스트셀러</li>
                        <li className="dropdownlist" onClick={() => navigate("/category2")}>전체상품</li>
                        <li className="dropdownlist" onClick={() => navigate("/category3")}>남성향수</li>
                        <li className="dropdownlist" onClick={() => navigate("/category4")}>여성향수</li>
                        <li className="dropdownlist" onClick={() => navigate("/category5")}>향수 기프트 세트</li>
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") search();
                    }}
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
                            transform: `translateX(-${index * 53}%)`,
                            width: "200%",
                            display: "flex",
                            transition: "0.5s ease"
                        }}
                    >

                        {/* 페이지 1 : WOMAN */}
                        <div className="slide-page"
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px"
                            }}
                        >
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

                        {/* 페이지 2 : MAN */}
                        <div className="slide-page"
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px"
                            }}
                        >
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

            {loginOpen && <div className="overlay" onClick={() => setLoginOpen(false)} />}

        </div>
    );
}

export default Category;