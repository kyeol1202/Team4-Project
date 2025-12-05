import { useNavigate } from "react-router-dom";

function Category4() {
    const navigate = useNavigate();

    return (

        <>
            카테고리4페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Category4;