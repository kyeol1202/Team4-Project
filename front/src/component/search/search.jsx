import { useParams } from "react-router-dom";

function SearchPage() {
    const { keyword } = useParams();

    const products = [
        { id: 1, name: "가벼운 향수", img: "/image/AuRa Etherlune.png" },
        { id: 2, name: "달콤한 향수", img: "/image/AuRa Noctivale.png" },
        { id: 3, name: "남성 향수", img: "/image/AuRa Primeveil.png" },
        { id: 4, name: "달콤한이었다가 아닌", img: "/image/AuRa Silvaron.png" },
    ];

    const filtered = products.filter((item) =>
        item.name.includes(keyword)
    );

    return (
        <div className="search-page">
            <h2>"{keyword}" 검색 결과</h2>

            {filtered.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                <div className="result-list">
                    {filtered.map((item) => (
                        <div key={item.id} className="product-item">
                            <img src={item.img} alt={item.name} />
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;
