import { useNavigate } from "react-router-dom";

function Service(){
    const navigate = useNavigate();

    return(

        <>
            고객센터페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Service;