// context/WishContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
  const [wishList, setWishList] = useState(() => JSON.parse(localStorage.getItem("wish")) || []);

  useEffect(() => {
    localStorage.setItem("wish", JSON.stringify(wishList));
  }, [wishList]);

  const addToWish = (product) => {
    setWishList((prev) => {
      if (!prev.find((item) => item.id === product.id)) return [...prev, product];
      return prev;
    });
  };

  const removeFromWish = (id) => setWishList((prev) => prev.filter((item) => item.id !== id));

  return (
    <WishContext.Provider value={{ wishList, addToWish, removeFromWish }}>
      {children}
    </WishContext.Provider>
  );
}

export const useWish = () => useContext(WishContext);
