import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Search() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword")?.toLowerCase();

    const [products, setProducts] = useState([]);
    const [newKeyword, setNewKeyword] = useState(keyword || "");

    // 🔍 검색 function
    function search() {
        if (!newKeyword.trim()) return alert("검색어를 입력하세요!");
        navigate(`/search?keyword=${newKeyword}`);
    }

    useEffect(() => {
        if (!keyword) return;

        fetch(`http://192.168.0.224:8080/api/products?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
            })
            .catch(err => console.log("검색 에러:", err));
    }, [keyword]);

    return (
        <div className="search-page">

            {/* 🔍 검색창 UI 추가 */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="검색하기"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                />
                <button className="search" onClick={search}>🔍</button>
            </div>

            <h1 className="search-title">“{keyword}” 검색 결과</h1>

            {products.length === 0 && (
                <p className="no-result">검색 결과가 없습니다.</p>
            )}

            <div className="product-grid">
                {products.map((item) => (
                    <div key={item.product_id} className="product-card2">
                        <h3>{item.name}</h3>
                        <p>{item.price} 원</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
