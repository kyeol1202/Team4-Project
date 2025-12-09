import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
  const [wishList, setWishList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishList")) || []; } 
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }, [wishList]);

  const addToWish = (item) => {
    if (!wishList.find(w => w.id === item.id)) setWishList(prev => [...prev, item]);
  };

  const removeFromWish = (id) => setWishList(prev => prev.filter(item => item.id !== id));

  const toggleWish = (item) => {
    if (wishList.find(w => w.id === item.id)) removeFromWish(item.id);
    else addToWish(item);
  };

  return (
    <WishContext.Provider value={{ wishList, addToWish, removeFromWish, toggleWish }}>
      {children}
    </WishContext.Provider>
  );
}

export const useWish = () => useContext(WishContext);
