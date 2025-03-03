
import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
axios.defaults.withCredentials=true;
import { APIBASEURL, AUTHPREFIX } from "../utilities/ApiEndpoint";


interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => { },
  logout: () => { },
  verifyAuth: async () => { },
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await axios.get(`${APIBASEURL}${AUTHPREFIX}/verify`, { withCredentials: true });
      setUser(response.data.user)
      setToken(response.data.token)

    } catch (err) {
      console.log(err)
      setUser(null);
      setToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${APIBASEURL}${AUTHPREFIX}/login`, { email, password }, { withCredentials: true });

      console.log(response);
      if (response.status !== 200) {
        throw new Error("Invalid Login Credentials");
      }

      const access_token = response.data.access_token;
      const userData = response.data.user;

      setToken(access_token);
      setUser(userData);

    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
};