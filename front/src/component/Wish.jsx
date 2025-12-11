import { useWish } from "../context/WishContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Wish.css";

const API_URL = "http://192.168.0.224:8080";

function Wish() {
    const navigate = useNavigate();
    const { wishList, toggleWish, fetchWishList } = useWish();

    useEffect(() => {
        fetchWishList();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h2>찜 목록</h2>

            {wishList.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#777", marginTop: "20px" }}>
                    찜한 상품이 없습니다.
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        marginTop: "20px",
                    }}
                >
                    {wishList.map((item) => (
                        <div
                            key={item.product_id || item.wishilist_id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                borderRadius: "8px",
                                width: "200px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: "#fff",
                            }}
                            // 🔥 카드 전체 클릭 → 상세페이지 이동
                            onClick={() => navigate(`/product/${item.product_id}`)}
                        >
                            {/* 내부 요소 클릭 시 상세 이동 막아야 하는 버튼 등은 stopPropagation */}
                            <div>
                                {item.img && (
                                    <img
                                        src={`${API_URL}${item.img}`}
                                        alt={item.name}
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            marginBottom: "10px",
                                        }}
                                    />
                                )}
                                <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>
                                    {item.name}
                                </h3>
                                <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                                    {item.price?.toLocaleString()}원
                                </p>
                            </div>

                            {/* ❤️ 삭제 버튼 → 상세 페이지 이동 안 되게 막기 */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // 상세 페이지 이동 막기
                                    toggleWish({ product_id: item.product_id });
                                }}
                                style={{
                                    fontSize: "18px",
                                    color: "red",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    marginTop: "10px",
                                }}
                            >
                                ❤️ 삭제
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        background: "#000",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    쇼핑 계속하기
                </button>
            </div>
        </div>
    );
}

export default Wish;
