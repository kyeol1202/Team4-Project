import { useWish } from "../context/WishContext";
import { useNavigate } from "react-router-dom";
import "./Wish.css";

function Wish() {
    const navigate = useNavigate();
    const { wishList, toggleWish } = useWish();

    return (
        <div style={{ padding: "40px" }}>
            <h2>찜 목록</h2>

            {wishList.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#777", marginTop: "20px" }}>찜한 상품이 없습니다.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
                    {wishList.map(item => (
                        <div key={item.id} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", width: "200px", textAlign: "center" }}>
                            {item.img && <img src={item.img} alt={item.name} style={{ width: "100%", height: "150px", objectFit: "cover", marginBottom: "10px" }} />}
                            <h3>{item.name}</h3>
                            <p>{item.price.toLocaleString()}원</p>
                            <button
                                onClick={() => toggleWish(item)}
                                style={{ fontSize: "20px", color: "red", border: "none", background: "none", cursor: "pointer", marginTop: "10px" }}
                            >
                                ❤️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{ padding: "10px 20px", border: "none", borderRadius: "5px", background: "#000", color: "#fff", cursor: "pointer" }}
                >
                    쇼핑 계속하기
                </button>
            </div>
        </div>
    );
}

export default Wish;

