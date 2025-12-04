import { useNavigate } from "react-router-dom";

function Cart(){
    const navigate = useNavigate();

    return(

        <>
            장바구니페이지
            <button onClick={() => navigate("/")}>이전</button>

            <button onClick={() => navigate("/payment")}>결제하기</button>


        </>
    )

}

export default Cart;