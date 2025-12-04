import { useNavigate } from "react-router-dom";

function Wish(){
    const navigate = useNavigate();

    return(

        <>
            찜페이지
            <button onClick={() => navigate("/")}>이전</button> 
        </>
    )

}

export default Wish;