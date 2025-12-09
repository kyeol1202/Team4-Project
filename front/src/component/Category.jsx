import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Category.css';

function Category() {

    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState("");


    const navigate = useNavigate();

    // useEffect(() => {
    //     const saved = localStorage.getItem("login");
    //     if (saved === "true") setLogin(true);
    // }, []);

    // 🔥 설명 추가된 데이터
    const [woman, setWoman] = useState([
        { 
            product_id: 1, 
            name: "AuRa Primeveil",
            desc: "전 세계 333병 한정 로맨틱 플로럴 향기",
            img: "/image/AuRa_Primeveil_woman.png"
        },
        { 
            product_id: 2, 
            name: "AuRa Elenique",
            desc: "고급스러운 우아함이 부드럽게 퍼지는 향",
            img: "/image/AuRa_Elenique_woman.jpeg" 
        },
        { 
            product_id: 3, 
            name: "AuRa Etherlune",
            desc: "달빛이 감싸는 몽환적인 향기",
            img: "/image/AuRa_Etherlune_woman.png" 
        },
    ]);

    const [man, setMan] = useState([
        { 
            product_id: 5, 
            name: "AuRa Silvaron",
            desc: "시원하고 고급스러운 우디 머스크 향",
            img: "/image/AuRa_Silvaron_man.png" 
        },
        { 
            product_id: 6, 
            name: "AuRa Noctivale",
            desc: "밤의 기운을 품은 강렬한 세이비티향",
            img: "/image/AuRa_Noctivale_man.png" 
        },
        { 
            product_id: 7, 
            name: "AuRa Solivane",
            desc: "바람처럼 은은하게 감기는 잔향",
            img: "/image/AuRa_Solivane_man.jpeg" 
        },
    ]);

    const slides = [woman, man];

    const slideRight = () => setIndex((prev) => (prev + 1) % slides.length);
    const slideLeft = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    function search() {
        if (!surcharge.trim()) return alert("검색어를 입력하세요!");
        navigate(`/search?keyword=${surcharge}`);
    }

    

    return (
        <div className="page">

            {/* 검색 */}
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
                    <div className="slider-inner" style={{ transform: `translateX(-${index * 50}%)` }}>

                        {/* WOMAN */}
                        <div className="slide-page">
                            {woman.map(item => (
                                <div className="product-card" key={item.product_id}>
                                    <button onClick={() => navigate(`/product/${item.product_id}`)}>
                                        <img src={item.img} alt={item.name} className="product-img"/>
                                    </button>

                                    {/* 🔥 텍스트 추가 부분 */}
                                    <h3 className="product-name">{item.name}</h3>
                                    <p className="product-desc">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* MAN */}
                        <div className="slide-page">
                            {man.map(item => (
                                <div className="product-card" key={item.product_id}>
                                    <button onClick={() => navigate(`/product/${item.product_id}`)}>
                                        <img src={item.img} alt={item.name} className="product-img"/>
                                    </button>

                                    {/* 🔥 텍스트 추가 부분 */}
                                    <h3 className="product-name">{item.name}</h3>
                                    <p className="product-desc">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <span className="arrow right" onClick={slideRight}>›</span>
            </div>


        </div>
    );
}

export default Category;
