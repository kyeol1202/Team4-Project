import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Main() {

    const [index, setIndex] = useState(0);



    const navigate = useNavigate();

    // useEffect(() => {
    //     const saved = localStorage.getItem("login");
    //     if (saved === "true") setLogin(true);
    // }, []);

    // 🔥 설명 추가된 데이터

    const [woman, setWoman] = useState([
        { 
            product_id: 7, 
            name: "AuRa Primeveil",
            desc: "전 세계 333병 한정 로맨틱 플로럴 향기",
            img: "/image/AuRa_Primeveil_woman.png"
        },
        { 
            product_id: 4, 
            name: "AuRa Elenique",
            desc: "고급스러운 우아함이 부드럽게 퍼지는 향",
            img: "/image/AuRa_Elenique_woman.jpeg"
        },
        { 
            product_id: 5, 
            name: "AuRa Etherlune",
            desc: "달빛이 감싸는 몽환적인 향기",
            img: "/image/AuRa_Etherlune_woman.png"
        },
    ]);

    const [man, setMan] = useState([
        { 
            product_id: 8, 
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
            product_id: 9, 
            name: "AuRa Solivane",
            desc: "바람처럼 은은하게 감기는 잔향",
            img: "/image/AuRa_Solivane_man.jpeg"
        },
    ]);

    const slides = [woman, man];

    const slideRight = () => setIndex((prev) => (prev + 1) % slides.length);
    const slideLeft = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);





    return (
        <>
            <div className="page1">
                <video
                    className="main-video"
                    src="image/향수광고영상.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>

            <div className="page2">
                <img
                    className="perfume-detail"
                    src="image/image.png"
                />
                <div className="textbox">

                    <h3>AuRa — 당신의 느낌을 향으로 기록하다</h3>
                    <p>
                        “한 번의 스침, 한 번의 숨결.
                        AuRa의 향은 당신의 분위기와 어우러져
                        세상에 단 하나의 잔향을 남깁니다.
                        <br></br>
                        지나가는 순간마저 특별하게—
                        AuRa Perfume.”
                    </p>
                </div>
            </div>
            



            <div className="page">


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
                                            <img src={item.img} alt={item.name} className="product-img" />
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
                                            <img src={item.img} alt={item.name} className="product-img" />
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
        </>
    );
}

export default Main;
