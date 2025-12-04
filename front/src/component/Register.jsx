
import { useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate();
    const [id,setId] = useState('');
    const [pw,setPw] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [adress,setAdress] = useState('');
    const [number,setNumber] = useState('');
    const [hbd,setHbd] = useState(''); //hbd >> 생년월일

    function Register() {
        localStorage.setItem('id',id);
        localStorage.setItem('pw',pw);
        localStorage.setItem('name',name);
        localStorage.setItem('email',email);
        localStorage.setItem('adress',adress);
        localStorage.setItem('number',number);
        localStorage.setItem('hbd',hbd);
        
        
    }
    
    return(

        <>
            <input onChange={(e)=>setId(e.target.value)}/>
            <input onChange={(e)=>setPw(e.target.value)}/> 
            <input onChange={(e)=>setName(e.target.value)}/>
            <input onChange={(e)=>setEmail(e.target.value)}/>  
            <input onChange={(e)=>setAdress(e.target.value)}/>
            <input onChange={(e)=>setNumber(e.target.value)}/>  
            <input onChange={(e)=>setHbd(e.target.value)}/> 
            <button onClick={() => navigate("/")}>이전</button>
        </>
    )

}

export default Register;