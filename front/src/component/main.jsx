import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {

    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    // const [scrollDir, setScrollDir] = useState("up");
    // 등장 애니메이션 (스크롤 감지)
    const [visibleSection, setVisibleSection] = useState(1);

useEffect(() => {
  const sections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target.getAttribute("data-section");
        setVisibleSection(Number(sec));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => observer.observe(sec));
}, []);

    useEffect(() => {
        let lastScroll = window.scrollY;

        const handleScroll = () => {
            const current = window.scrollY;

            if (current > lastScroll && current > 200) {
                setScrollDir("down");   // 200px보다 내려갔을 때만 숨김
            }
            else if (current < lastScroll - 30) {
                setScrollDir("up");     // 30px 이상 올라갈 때만 나타남
            }

            lastScroll = current;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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

        <div className="top-marquee-bar">
  <div className="marquee-content">
    <span>4TEAM</span>
    <span>신은지</span>
    <span>김한결(팀장님)</span>
    <span>윤종빈</span>
    <span>이선화</span>
    {/* 반복되는 문구들을 적당히 넣기 */}
  </div>
</div>

          
          <video
    className="main-video2"
    src="image/광고영상2.mp4"
    autoPlay
    loop
    muted
    playsInline
  />

  <div className="title-overlay">
  <h1 className="line1 tracking-in-expand-fwd-bottom">A good day</h1>
  <h1 className="line2 tracking-in-expand-fwd-bottom">
    to empty the buyer's wallet
  </h1>
  
  <button
          className="video-link-btn"
          onClick={() => navigate("/Category2")}
        >
          상품 보러가기
        </button>
        
</div>



<div
  className={`page3 fade-section ${visibleSection === 1 ? "show" : "hide"}`}
  data-section="1"
>
{/*왼쪽광고영상*/}
  <video
    className="main-video1"
    src="image/향수광고영상.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
  
  {/* 가운데 세로 라인 */}
  <div className="divider" />

   <div className="right-panel"></div>
  <img className="perfume-detail" src="image/image.png" />

  <div className="textbox">
    <h3>AuRa — 당신의 느낌을 향으로 기록하다</h3>
    <p>
      “한 번의 스침, 한 번의 숨결.<br />
      AuRa의 향은 당신의 분위기와 어우러져<br />
      세상에 단 하나의 잔향을 남깁니다.<br />
      지나가는 순간마저 특별하게"<br />
    </p>
    <button
          className="model-btn"
          onClick={() => navigate("http://192.168.0.224:5173/product/7")}
        >
          Aura Primeveil 보러가기
        </button>
  </div>
</div>




<div
  className={`page fade-section ${visibleSection === 2 ? "show" : "hide"}`}
  data-section="2"
>
  <h1 className="section-title">
    {index === 0 ? "WOMAN BEST SELLERS" : "MAN BEST SELLERS"}
  </h1>

  <div className="slider-wrapper">
    <span className="arrow left" onClick={slideLeft}>
      ‹
    </span>

    <div className="slider">
      <div
        className="slider-inner"
        style={{ transform: `translateX(-${index * 50}%)` }}
      >
        <div className="slide-page">
          {woman.map(item => (
            <div className="product-card" key={item.product_id}>
              <button onClick={() => navigate(`/product/${item.product_id}`)}>
                <img
                  src={`http://192.168.0.224:8080${item.img}`}
                  className="product-img"
                />
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
                <img
                  src={`http://192.168.0.224:8080${item.img}`}
                  className="product-img"
                />
              </button>
              <h3 className="product-name">{item.name}</h3>
              <p className="product-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <span className="arrow right" onClick={slideRight}>
›
    </span>
  </div>
</div>
<div className="empty">


</div>
        </>
    );
}

export default Main;
