import React, { useContext, useEffect, useState, createContext } from "react";
import { delAuth, getAuth, setAuth } from "../utils/functions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuthProvider] = useState(getAuth());

  const loggIn = (a) => setAuthProvider(a);
  const loggOut = () => setAuthProvider(undefined);

  useEffect(() => {
    auth ? setAuth(auth) : delAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, loggIn, loggOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
