import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Main from "./component/main"
import Cart from "./component/Cart";
import Category from "./component/Category";
import Payment from "./component/Payment";
import Register from "./component/Register";
import Wish from "./component/Wish";
import Service from "./component/Service";


function App() {
  return (


    <>
      {/*
    네비게이터 연결부분dsfds
      test12312321
    Main = 메인화면 11
    */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />{/* 메인 페이지 */}
          <Route path="/cart" element={<Cart />} /> {/* 장바구니 페이지 */}
          <Route path="/category" element={<Category />} />{/* 카테고리 페이지 */}
          <Route path="/payment" element={<Payment />} />{/* 결제 페이지 */}
          <Route path="/register" element={<Register />} />{/* 회원가입 페이지 */}
          <Route path="/wish" element={<Wish />} />{/* 찜 목록 페이지 */}
          <Route path="/service" element={<Service />} />{/* 고객센터 페이지 */}
        </Routes>
      </BrowserRouter>
    </>

  );


}
export default App; 
