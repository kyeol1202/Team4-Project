import React from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>상품 상세 페이지</h1>
      <h2>상품 ID: {id}</h2>

      <p>여기에 상품 상세 정보 표시하면 됨</p>
    </div>
  );
}

export default ProductDetail;
