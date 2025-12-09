import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {

    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const products = [
        { id: 1, img: "image/AuRa_Primeveil_woman.png" },
        { id: 2, img: "image/AuRa_Elenique_woman.jpeg" },
        { id: 3, img: "image/AuRa_Etherlune_woman.png" },
        { id: 4, img: "image/AuRa_Silvaron_man.png" },
        { id: 5, img: "image/AuRa_Noctivale_man.png" },
        { id: 6, img: "image/AuRa_Solivane_man.jpeg" },
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

    return (
        <div className="page">

            {/* 검색 */}

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
