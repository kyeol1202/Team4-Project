import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Category.css';

function Category() {

    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState("");


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

    

    return (
        <div className="page">

            {/* HEADER */}

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
            <div className="slider-wrapper2">
                <span className="arrow2 left" onClick={slideLeft}>‹</span>

                <div className="slider2">
                    <div
                        className="slider-inner2"
                        style={{
                            transform: `translateX(-${index * 50}%)`,
                        }}
                    >

                        {/* WOMAN */}
                        <div className="slide-page2">
                            {woman.map(item => (
                                <button
                                    className="product-card2"
                                    key={item.product_id}
                                    onClick={() => navigate(`/product/${item.product_id}`)}
                                >
                                    <img src={item.img} alt={item.name} className="product-img" />
                                </button>
                            ))}
                        </div>

                        {/* MAN */}
                        <div className="slide-page2">
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

                <span className="arrow2 right" onClick={slideRight}>›</span>
            </div>

           
            

        </div>
    );
}

export default Category;
