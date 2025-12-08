import { useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
import { useEffect, useState } from "react";

function Wish() {
    const navigate = useNavigate();
    const { wishList, removeFromWish } = useWish();
    const [user, setUser] = useState(null);

    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (err) {
            console.error("User 데이터 파싱 오류:", err);
            localStorage.removeItem("user"); // 깨진 데이터 제거
            navigate("/");
        }
    } else {
        alert("로그인 후 이용 가능합니다.");
        navigate("/");
    }
}, [navigate]);


    if (!user) return null;

    return (
        <div style={{ padding: "40px" }}>
            <h2>찜 목록</h2>

            {wishList.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#777", marginTop: "20px" }}>
                    찜한 상품이 없습니다.
                </p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
                    {wishList.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                borderRadius: "8px",
                                width: "200px",
                                textAlign: "center"
                            }}
                        >
                            {item.img && (
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "10px" }}
                                />
                            )}
                            <h3>{item.name}</h3>
                            <p>{item.price.toLocaleString()}원</p>
                            <button
                                style={{
                                    padding: "8px 12px",
                                    border: "none",
                                    borderRadius: "5px",
                                    background: "#000",
                                    color: "#fff",
                                    cursor: "pointer",
                                    marginTop: "10px"
                                }}
                                onClick={() => removeFromWish(item.id)}
                            >
                                찜 해제
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        background: "#000",
                        color: "#fff",
                        cursor: "pointer"
                    }}
                    onClick={() => navigate("/")}
                >
                    쇼핑 계속하기
                </button>
            </div>
        </div>
    );
}

export default Wish;
