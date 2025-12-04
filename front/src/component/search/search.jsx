import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword")?.toLowerCase();

    const products = [
        { id: 1, name: "가벼운 향수", img: "/image/AuRa Etherlune.png" },
        { id: 2, name: "달콤한 향수", img: "/image/AuRa Noctivale.png" },
        { id: 3, name: "남성 향수", img: "/image/gam.png" },
        { id: 4, name: "달콤한이었다가 아닌", img: "/image/gam2.jpeg" },
    ];

     // 검색된 상품만 필터링
    const filtered = useMemo(() => {
        if (!keyword) return [];
        return products.filter((p) =>
            p.name.toLowerCase().includes(keyword)
        );
    }, [keyword]);

    return (
        <div className="search-page">
            <h1 className="search-title">“{keyword}” 검색 결과</h1>

            {filtered.length === 0 && (
                <p className="no-result">검색 결과가 없습니다.</p>
            )}

            <div className="product-grid">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="product-card2"
                        onClick={() => navigate(`/product/${item.id}`)}
                    >
                        <img src={item.img} alt={item.name} />
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;