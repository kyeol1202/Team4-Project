import React from "react";
import Main from "./component/main"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";


  function App() {
  return (

    
    <>
    {/*
<<<<<<< HEAD
    네비게이터 연결부분np
=======
    네비게이터 연결부분dsfds
>>>>>>> d509f61bfe085853ec04ba2ebcbb69a17b07a264

    Main = 메인화면 11
    */}
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </BrowserRouter>
    </>
    
  );

  
}
export default App; 
