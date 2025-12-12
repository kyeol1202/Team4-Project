import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // 정렬 옵션
  const [sort, setSort] = useState("");

  // 가격 필터
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 카테고리 이름 매핑
  const categoryNames = {
    1: "남성 상품",
    2: "여성 상품",
    3: "특가 상품",
    4: "크리스마스 상품"
  };

  const categoryTitle = categoryNames[categoryId] || "상품 목록";

  useEffect(() => {
    async function fetchProducts() {

      let url = "";

      if (categoryId === "all") {
        url = "http://192.168.0.224:8080/api/products/all?";
      } else {
        url = `http://192.168.0.224:8080/api/products/category/${categoryId}?`;
      }
      if (sort) url += `sort=${sort}&`;
      if (minPrice) url += `min=${minPrice}&`;
      if (maxPrice) url += `max=${maxPrice}&`;

      const res = await fetch(url);
      const data = await res.json();
      console.log("요청 URL :", url);  // ★ 확인용
      if (data.success) setProducts(data.data);
    }

    fetchProducts();
  }, [categoryId, sort, minPrice, maxPrice]);

  return (
    <div className="category-page">
      <h1 className="category-title">{categoryTitle}</h1>

      {/* ⭐ 정렬 + 필터 영역 */}
      <div className="filter-box">
        {/* 가격 필터 */}
        <div className="price-filter">
          <input
            type="number"
            placeholder="최소 가격"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="최대 가격"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* 정렬 선택 */}
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">정렬 없음</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
          <option value="new">신상품순</option>
        </select>
      </div>

      {/* 상품 목록 */}
      {products.length === 0 ? (
        <p className="no-result">상품이 없습니다.</p>
      ) : (
        <div className="category-grid">
          {products.map((p) => (
            <div className="category-card" key={p.product_id}>
              <button
                className="category-img-btn"
                onClick={() => navigate(`/product/${p.product_id}`)}
              >
                <img
                  src={`http://192.168.0.224:8080${p.img}`}
                  alt={p.name}
                  className="product-img"
                />
              </button>

              <h3 className="category-name">{p.name}</h3>
              <p className="category-desc">{p.description?.slice(0, 25)}...</p>
              <p className="category-price">{Number(p.price).toLocaleString()}원</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
