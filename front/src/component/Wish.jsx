import { useNavigate } from "react-router-dom";
import { useWish } from "../context/WishContext";
import { useEffect, useState } from "react";


function Wish(){
    const navigate = useNavigate();
    const { wishList, removeFromWish } = useWish();
    const [user, setUser] = useState(null);

     // 로그인 체크
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else {
            alert("로그인 후 이용 가능합니다.");
            navigate("/");
        }
    }, [navigate]);

    if (!user) return null;

    return(

        <div style={{ padding : "40px" }}>
            <h2>찜 목록</h2>
            { wishList.length === 0 && <p>찜한 상품이 없습니다.</p>}
            <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
                { wishList.map((item) => (
                    <div key={item.id} style={{ 
                        border: "1px solid #ddd", padding: "20px", borderRadius: "8px", width: "200px" }}>
           <h3>{item.name}</h3>
           <p>{item.price.toLocaleString()}원</p>
              <button onClick={() => removeFromWish(item.id)}>찜 해제</button>
            </div>
                ))}
            </div>
            <div style = {{ marginTop: "20px" }}>
            <button onClick={() => navigate("/")}>메인으로</button> 
        </div>
        </div>
    )

}

export default Wish;