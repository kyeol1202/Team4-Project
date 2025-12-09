// context/WishContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const WishContext = createContext();

export function WishProvider({ children }) {
  const [wish, setWish] = useState(() => JSON.parse(localStorage.getItem("wish")) || []);

  useEffect(() => {
    localStorage.setItem("wish", JSON.stringify(wish));
  }, [wish]);

  const addToWish = (product) => {
    setWish((prev) => {
      if (!prev.find((item) => item.id === product.id)) return [...prev, product];
      return prev;
    });
  };

  const removeFromWish = (id) => setWish((prev) => prev.filter((item) => item.id !== id));

  return (
    <WishContext.Provider value={{ wish, addToWish, removeFromWish }}>
      {children}
    </WishContext.Provider>
  );
}

export function useWish() {
  return useContext(WishContext);
}
