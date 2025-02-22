
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { APIBASEURL, AUTHPREFIX } from "../utilities/ApiEndpoint";


interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${APIBASEURL}${AUTHPREFIX}/login`, { email, password });
      if (response.status !== 200) {
        throw new Error("Invalid Login Credentials");
      }

      const access_token = response.data.access_token;
      const userData = response.data.user;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};