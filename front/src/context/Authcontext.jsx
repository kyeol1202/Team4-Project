import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginCheck = localStorage.getItem("login");
    setIsLogin(!!loginCheck);
  }, []);

  const login = (userInfo) => {
    localStorage.setItem("login", "true");
    localStorage.setItem("user", JSON.stringify(userInfo));
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    setIsLogin(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


