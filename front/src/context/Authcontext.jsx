import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedLogin = localStorage.getItem("login") === "true";
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setIsLogin(savedLogin);
    setUser(savedUser);
  }, []);

  const login = (userData) => {
    localStorage.setItem("login", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLogin(true);
    setUser(userData);
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




