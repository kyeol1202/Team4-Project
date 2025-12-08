import { useNavigate } from "react-router-dom";

function Category3() {
    const navigate = useNavigate();

    return (

        <>
            카테고리3페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Category3;