import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Search() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");           // <= 원본 보관!
    const searchKeyword = keyword?.toLowerCase();    // <= 검색용 변환!

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!searchKeyword) return;

        fetch(`http://192.168.0.224:8080/api/products?keyword=${searchKeyword}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
            })
            .catch(err => console.log("검색 에러:", err));
    }, [searchKeyword]);

    return (
        <div className="search-page">
            <h1 className="search-title">“{keyword}” 검색 결과</h1>

            {products.length === 0 && (
                <p className="no-result">검색 결과가 없습니다.</p>
            )}

            <div className="product-grid">
                {products.map((item) => (
                    <div className="product-card" key={item.product_id}>
                        <button onClick={() => navigate(`/product/${item.product_id}`)}>
                            <img src={`http://192.168.0.224:8080${item.img}`} />
                        </button>

                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-desc">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
