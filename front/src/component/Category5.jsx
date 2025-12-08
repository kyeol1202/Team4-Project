import { useNavigate } from "react-router-dom";

function Category5() {
    const navigate = useNavigate();

    return (

        <>
            카테고리5페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Category5