import { useNavigate } from "react-router-dom";

function Category2() {
    const navigate = useNavigate();

    return (

        <>
            카테고리2페이지
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Category2;