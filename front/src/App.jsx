import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";

import Main from "./component/Main";
import Cart from "./component/Cart";
import Payment from "./component/Payment";
import Register from "./component/Register";
import Wish from "./component/Wish";
import Service from "./component/Service";
import Mypage from "./component/Mypage";
import Category from "./component/Category";
import Category2 from "./component/Category2";
import Category3 from "./component/Category3";
import Category4 from "./component/Category4";
import Category5 from "./component/Category5";
import Search from "./component/search/Search";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wish" element={<Wish />} />
          <Route path="/service" element={<Service />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category2" element={<Category2 />} />
          <Route path="/category3" element={<Category3 />} />
          <Route path="/category4" element={<Category4 />} />
          <Route path="/category5" element={<Category5 />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
