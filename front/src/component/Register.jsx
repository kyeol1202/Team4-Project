
import { useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate();

    return(

        <>
            회원가입페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Register;