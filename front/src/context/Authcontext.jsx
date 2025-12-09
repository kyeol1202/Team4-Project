import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loginCheck = localStorage.getItem("login");
    const savedUser = localStorage.getItem("user");
    setIsLogin(!!loginCheck);
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, []);

  const login = (userInfo) => {
    localStorage.setItem("login", "true");
    localStorage.setItem("user", JSON.stringify(userInfo));
    setIsLogin(true);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    setIsLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}




