import { useNavigate } from "react-router-dom";

function Category() {
    const navigate = useNavigate();

    return (

        <>
            카테고리1페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Category;