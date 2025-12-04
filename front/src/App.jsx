import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Main from "./component/main"
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import Register from "./component/Register";
import Wish from "./component/Wish";
import Service from "./component/Service";
import Category from "./component/Category";
import Category2 from "./component/Category2";
import Category3 from "./component/Category3";
import Category4 from "./component/Category4";
import Category5 from "./component/Category5";
import Mypage from "./component/Mypage";
import SearchPage from "./component/search/search";


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
          <Route path="/search/:keyword" element={<SearchPage />} />
          <Route path="/" element={<Main />} />{/* 메인 페이지 */}
          <Route path="/cart" element={<Cart />} /> {/* 장바구니 페이지 */}
          <Route path="/category" element={<Category />} />{/* 카테고리 페이지 */}
          <Route path="/category2" element={<Category2 />} />{/* 카테고리 페이지 */}
          <Route path="/category3" element={<Category3 />} />{/* 카테고리 페이지 */}
          <Route path="/category4" element={<Category4 />} />{/* 카테고리 페이지 */}
          <Route path="/category5" element={<Category5 />} />{/* 카테고리 페이지 */}
          <Route path="/payment" element={<Payment />} />{/* 결제 페이지 */}
          <Route path="/register" element={<Register />} />{/* 회원가입 페이지 */}
          <Route path="/wish" element={<Wish />} />{/* 찜 목록 페이지 */}
          <Route path="/service" element={<Service />} />{/* 고객센터 페이지 */}
          <Route path="/mypage" element={<Mypage />} />{/* 마이페이지 */}
        </Routes>
      </BrowserRouter>
    </>

  );


}
export default App; 
