import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Service(){
    // const navigate = useNavigate();
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [number, setNumber] = useState('');
    const navigate = useNavigate();

    return(

        <>
            고객센터
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Service;