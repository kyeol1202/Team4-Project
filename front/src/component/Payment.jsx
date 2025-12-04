import { useNavigate } from "react-router-dom";
function Payment(){
    const navigate = useNavigate();

    return(

        <>
            결제페이지
            <button onClick={() => navigate("/cart")}>이전</button>
        </>
    )

}

export default Payment;