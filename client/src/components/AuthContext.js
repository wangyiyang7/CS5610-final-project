import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAccountId = localStorage.getItem("accountId");

    if (token && storedAccountId) {
      setIsAuthenticated(true);
      setAccountId(storedAccountId);
    }
    setLoading(false);
  }, []);

  const login = (token, accountId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("accountId", accountId);
    setIsAuthenticated(true);
    setAccountId(accountId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountId");
    setIsAuthenticated(false);
    setAccountId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, accountId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
