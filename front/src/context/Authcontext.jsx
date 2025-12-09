import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(() => {
    return JSON.parse(localStorage.getItem("isLogin")) || false;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
    localStorage.setItem("user", JSON.stringify(user));
  }, [isLogin, user]);

  const login = (userData) => {
    setIsLogin(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


