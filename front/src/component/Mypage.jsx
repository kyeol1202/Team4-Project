import { useNavigate } from "react-router-dom";

function Mypage(){
    const navigate = useNavigate();
    
    const Logout = () => {
        localStorage.removeItem("login");
        navigate("/");
    };
    return(

        <>

            마이페이지
            <button onClick={() => navigate("/")}>이전</button>
            <button onClick={Logout}>로그아웃</button>
        </>
    )
}

export default Mypage;