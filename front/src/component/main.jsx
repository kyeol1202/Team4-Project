import React, { useState, useEffect } from "react";

function Main() {
  const [index, setIndex] = useState(0);

  const products = ["제품 1", "제품 2", "제품 3", "제품 4", "제품 5", "제품 6"];

  const visibleCount = 3; // 화면에 보이는 카드 수
  const cardWidth = 330;  // 카드 폭
  const gap = 20;         // 카드 간격

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      slideRight();
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

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

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          MENU
          <ul className="dropdown">
            <li>베스트셀러</li>
            <li>전체상품</li>
            <li>남성향수</li>
            <li>여성향수</li>
            <li>향수 기프트 세트</li>
          </ul>
        </div>

        <div className="header-title">Aura</div>

        <div className="header-right">
          <button>♡</button>
          <button>🛒</button>
          <button>👤</button>
        </div>
      </header>

      {/* 검색창 */}
      <div className="search-box">
        <input type="text" placeholder="검색하기" />
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
            {products.map((item, i) => (
              <button key={i} className="product-card">
                {item}
              </button>
            ))}
          </div>
        </div>

        <span className="arrow right" onClick={slideRight}>›</span>
      </div>

      <footer className="footer">
        <button>🎧</button>
        <button>🤖</button>
      </footer>
    </div>
  );
}

export default Main;
