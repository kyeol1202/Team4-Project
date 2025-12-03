import React from "react";
import Main from "./component/main"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";


  function App() {
  return (

    
    <>
    {/*
    네비게이터 연결부분

    Main = 메인화면
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
