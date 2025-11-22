import { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

type User = {
  id?: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImageUrl?: string;
  role?: string;
} | null;

type AuthContextType = {
  token: string | null;
  user: User;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (token: string | null, user: User) => void;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) setTokenState(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  const setToken = (t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setTokenState(t);
    if (!t) setUser(null);
  };

  const setAuth = (t: string | null, u: User) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
    setTokenState(t);
    setUser(u);
  };

  const logout = () => setToken(null);

  const role = user?.role ?? null;
  const isAuthenticated = Boolean(token);
  const isAdmin = role === "admin";

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      isAdmin,
      setAuth,
      setToken,
      logout,
    }),
    [token, user, role, isAuthenticated, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { TOKEN_KEY, USER_KEY };
