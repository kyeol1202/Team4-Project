import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // 등장 애니메이션 (스크롤 감지)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting)
          entry.target.classList.add("show");
      });
    }, { threshold: 0.3 });

    document.querySelectorAll(".fade-section").forEach(el => {
      observer.observe(el);
    });
  }, []);

  const [woman, setWoman] = useState([
    { 
        product_id: 7, 
        name: "AuRa Primeveil",
        desc: "전 세계 333병 한정 로맨틱 플로럴 향기",
        img: "/uploads/AuRa_Primeveil_woman.png"
    },
    { 
        product_id: 4, 
        name: "AuRa Elenique",
        desc: "고급스러운 우아함이 부드럽게 퍼지는 향",
        img: "/uploads/AuRa_Elenique_woman.jpeg"
    },
    { 
        product_id: 5, 
        name: "AuRa Etherlune",
        desc: "달빛이 감싸는 몽환적인 향기",
        img: "/uploads/AuRa_Etherlune_woman.png"
    },
  ]);

  const [man, setMan] = useState([
    { 
        product_id: 8, 
        name: "AuRa Silvaron",
        desc: "시원하고 고급스러운 우디 머스크 향",
        img: "/uploads/AuRa_Silvaron_man.png"
    },
    {
        product_id: 6,
        name: "AuRa Noctivale",
        desc: "밤의 기운을 품은 강렬한 세이비티향",
        img: "/uploads/AuRa_Noctivale_man.png"
    },
    { 
        product_id: 9, 
        name: "AuRa Solivane",
        desc: "바람처럼 은은하게 감기는 잔향",
        img: "/uploads/AuRa_Solivane_man.jpeg"
    },
  ]);

  const slides = [woman, man];

  const slideRight = () => setIndex(prev => (prev + 1) % slides.length);
  const slideLeft = () => setIndex(prev => (prev - 1 + slides.length) % slides.length);

  
  return (
    <>

      {/* 🔥 메인 비주얼 */}
      <div className="page1 fade-section">
        <video
          className="main-video"
          src="image/향수광고영상.mp4"
          autoPlay loop muted playsInline
        />
      </div>

      {/* 🔥 메인 카피 */}
      <div className="fade-section" style={{ textAlign: "center", marginTop: "140px" }}>
        <div className="main-text">A good day</div>
        <div className="sub-text">to empty the buyer's wallet</div>
      </div>


      {/* 🔥 브랜드 설명 영역 */}
      <div className="page2 fade-section">
        <img className="perfume-detail" src="image/image.png"/>
        
        <div className="textbox">
          <h3>AuRa — 당신의 느낌을 향으로 기록하다</h3>
          <p>
            “한 번의 스침, 한 번의 숨결.
            AuRa의 향은 당신의 분위기와 어우러져
            세상에 단 하나의 잔향을 남깁니다.
            <br></br>
            지나가는 순간마저 특별하게— AuRa Perfume.”
          </p>
        </div>
      </div>


      {/* 🔥 BEST SELLER SLIDER */}
      <div className="page fade-section">

        <h1 className="section-title">
          {index === 0 ? "WOMAN BEST SELLERS" : "MAN BEST SELLERS"}
        </h1>

        <div className="slider-wrapper">
          <span className="arrow left" onClick={slideLeft}>‹</span>

          <div className="slider">
            <div className="slider-inner" style={{ transform: `translateX(-${index * 50}%)` }}>

              <div className="slide-page">
                {woman.map(item => (
                  <div className="product-card" key={item.product_id}>
                    <button onClick={() => navigate(`/product/${item.product_id}`)}>
                      <img src={`http://192.168.0.224:8080${item.img}`} className="product-img"/>
                    </button>
                    <h3 className="product-name">{item.name}</h3>
                    <p className="product-desc">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="slide-page">
                {man.map(item => (
                  <div className="product-card" key={item.product_id}>
                    <button onClick={() => navigate(`/product/${item.product_id}`)}>
                      <img src={`http://192.168.0.224:8080${item.img}`} className="product-img"/>
                    </button>
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

    </>
  );
}

export default Main;
