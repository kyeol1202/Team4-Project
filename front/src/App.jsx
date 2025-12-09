import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import { WishProvider } from "./context/WishContext";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";
import "./Search.css";
import './component/Category.css';

import Layout from "./component/Layout";
import Main from "./component/main";
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import Register from "./component/Register";
import Wish from "./component/Wish";
import Service from "./component/Service";
import QnaPage from "./component/QnaPage";
import Category2 from "./component/Category2";
import Category3 from "./component/Category3";
import Category4 from "./component/Category4";
import Mypage from "./component/Mypage";
import Search from "./component/search/search";
import OrderDetail from "./component/OrderDetail";
import EditUserInfo from "./component/EditUserInfo";
import ProductDetail from "./component/ProductDetail";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/main" element={<Main />} />

                <Route path="/search" element={<Search />} />
                <Route path="/category2" element={<Category2 />} />
                <Route path="/category3" element={<Category3 />} />
                <Route path="/category4" element={<Category4 />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />

                <Route path="/wish" element={<Wish />} />
                <Route path="/service" element={<Service />} />
                <Route path="/qna" element={<QnaPage />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/orderdetail" element={<OrderDetail />} />
                <Route path="/edituserinfo" element={<EditUserInfo />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
