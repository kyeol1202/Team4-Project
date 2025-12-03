import React from "react";
import "./App.css";

export default function WomanBestSellers() {
  const products = [
    {
      title: "AuRa Primeveil",
      subtitle: "2025 Royal Bridal Limited Edition",
      desc1: "전 세계 333병",
      desc2: "결혼식 당일, 딱 한 방울.\n그날의 신부가 되는 향기.",
      img: "/img/perfume1.png",
    },
    {
      title: "AuRa Elenique",
      subtitle: "조용히 빛나는 우아함",
      desc2: "하루 한 방울, 품격이 완성됩니다.",
      img: "/img/perfume2.png",
    },
    {
      title: "AuRa Etherlune",
      subtitle: "2025 Moonlit Edition",
      desc1: "달빛이 녹아내린 향",
      desc2: "밤에 한 방울만 뿌리세요. 오늘 당신은 달빛 그 자체가 됩니다.",
      img: "/img/perfume3.png",
    },
  ];

  return (
    <div className="aura-page">

      <header className="aura-header">
        <div className="menu-icon">☰</div>
        <div className="title">AuRa</div>

        <div className="search-box">
          <input type="text" placeholder="검색창" />
          <span className="search-icon">🔍</span>
        </div>

        <div className="header-icons">
          <span>♡</span>
          <span>🛒</span>
          <span>👤</span>
        </div>
      </header>

      <aside className="sidebar">
        <div>베스트셀러</div>
        <div>전체상품</div>
        <div>남성향수</div>
        <div>여성향수</div>
      </aside>

      <h1 className="section-title">WOMAN BEST SELLERS</h1>

      <div className="product-container">
        <span className="arrow left">‹</span>

        {products.map((p, i) => (
          <div className="product-card" key={i}>
            <img src={p.img} alt={p.title} />
            <div className="text-wrap">
              <h3>{p.title}</h3>
              <p className="subtitle">{p.subtitle}</p>
              {p.desc1 && <p className="desc1">“{p.desc1}”</p>}
              <p className="desc2">{p.desc2}</p>
            </div>
          </div>
        ))}

        <span className="arrow right">›</span>
      </div>

      <footer className="footer-icons">
        <span>🎧</span>
        <span>🤖</span>
      </footer>
    </div>
  );
}