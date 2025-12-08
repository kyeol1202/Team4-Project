import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {

    const [index, setIndex] = useState(0);
    const [surcharge, setSurcharge] = useState('');
    const navigate = useNavigate();

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

    useEffect(() => {
        const timer = setInterval(slideRight, 3000);
        return () => clearInterval(timer);
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

        </div>
    );
}

export default Main;
