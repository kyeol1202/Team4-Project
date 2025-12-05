import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Category() {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    return (

        <>
            카테고리1페이지
            <button onClick={() => navigate("/")}>이전</button>
            <button onClick={() => addToCart(p)}>장바구니 담기</button>
        </>
    )

}

export default Category;