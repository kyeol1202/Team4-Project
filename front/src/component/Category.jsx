import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWish } from "../context/WishContext";


function Category() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWish } = useWish();

    const p = { id: 1, name: "상품1", price: 1000};

    return (

        <>
            카테고리1페이지
            <button onClick={() => navigate("/")}>이전</button>
            <button onClick={() => addToWish(p)}>찜하기</button>
            <button onClick={() => addToCart(p)}>장바구니 담기</button>
        </>
    )

}

export default Category;