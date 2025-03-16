/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/helpers/superbaseClient";

interface AuthContextType {
  user: User | null;
  userInfo: any;
  isBalanceChanged: boolean;
  setBalanceChanged: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  fetchUserInfo: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userInfo, setUserInfo] = useState<any>(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });
  const [isBalanceChanged, setBalanceChanged] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("userInfo");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur de connexion :", error.message);
      throw error;
    }

    const currentUser = data.user;
    setUser(currentUser);
    localStorage.setItem("user", JSON.stringify(currentUser));

    if (currentUser) {
      await fetchUserInfo(email);
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Erreur d'inscription :", error.message);
      throw error;
    }

    const newUser = data.user;
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const fetchUserInfo = async (email: string) => {
    console.log("Email passé à fetchUserInfo :", email);
    const { data, error } = await supabase
      .from("Account")
      .select("id, user_name, role, auth_id, created_at")
      .eq("email", email)
      .single();
    console.log("Données récupérées :", data);

    if (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
      return;
    }

    if (data) {
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    }
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur de déconnexion :", error.message);
      throw error;
    }

    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        setUserInfo,
        userInfo,
        setBalanceChanged,
        isBalanceChanged,
        fetchUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
