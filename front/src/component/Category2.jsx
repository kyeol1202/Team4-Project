import React from "react";
import { useNavigate } from "react-router-dom";
import "./Category2.css";

function Category2() {
    const navigate = useNavigate();

    // ✔ 나중에 DB에서 불러올 실제 데이터 형태
    const products = [
        { id: 1, name: "AuRa Primeveil", img: "/image/per1.jpeg" },
        { id: 2, name: "AuRa Elenique", img: "/image/per2.jpeg" },
        { id: 3, name: "AuRa Vorelle", img: "/image/per3.jpeg" },
        { id: 4, name: "AuRa Immeren", img: "/image/per4.jpeg" },
        { id: 5, name: "AuRa Noctivale", img: "/image/per5.jpeg" },
        { id: 6, name: "AuRa Solivane", img: "/image/per6.jpeg" },
        { id: 7, name: "AuRa Freesia", img: "/image/per7.jpeg" },
        { id: 8, name: "AuRa Vanilla Musk", img: "/image/per8.jpeg" },
    ];

    return (
        <div className="all-container">
            <h1 className="all-title">Perfume</h1>

            <div className="circle-wrapper">
                {products.map((item) => (
                    <div
                        key={item.id}
                        className="circle-item"
                        onClick={() => navigate(`/product/${item.id}`)}
                    >
                        <img src={item.img} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Category2;
