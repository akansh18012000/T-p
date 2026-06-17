import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const USER_ME_API_URL = "/api/v1/user/me";

export interface User {
  user_id: string;
  email: string;
  username: string;
  role_id: string | null;
  role_name: string;
  status: string;
  last_login_at: string;
}

export type UserDataStatus = "idle" | "loading" | "loaded" | "error";

interface UserContextValue {
  user: User | null;
  status: UserDataStatus;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({   "user_id": "ecefa784-b867-4e0d-94e2-d45e6d4f5611",   "email": "akansh.omar@terumomedical.com",   "username": "Akansh Omar",   "role_id": null,   "role_name": "BUSINESS PLANNING",   "status": "ACTIVE",   "last_login_at": "2026-06-06T15:04:35.692284" });
  const [status, setStatus] = useState<UserDataStatus>("idle");

  // Guards against the call firing more than once — both for React StrictMode's
  // double-invoked effect in dev and any future remounts of the provider. The
  // provider sits above the Router, so this effect runs a single time per page
  // load and never re-fires while the user navigates within the app.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus("loading");

    void (async () => {
      try {
        const res = await fetch(USER_ME_API_URL, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`User me HTTP ${res.status}`);
        }
        const json = (await res.json()) as User;
        setUser(json);
        setStatus("loaded");
      } catch (e) {
        console.error("Failed to load user:", e);
        setStatus("error");
      }
    })();
  }, []);

  const value: UserContextValue = { user, status };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (ctx == null) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
