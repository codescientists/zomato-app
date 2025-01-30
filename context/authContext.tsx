import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Define the User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Define the AuthProvider's props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");

        if (userData && token) {
          const parsedUser = JSON.parse(userData)
          setUser({ ...parsedUser, token: token });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage:", error);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        // Throw an error if the response is not successful
        const errorMessage = await response.text(); // Parse error message from the response
        console.error("Error response:", errorMessage);
        alert("Login failed. Please try again.");
        return;
      }

      const data = await response.json(); // Parse response body as JSON

      if (data?.user && data?.token) {
        // Save user and token to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);

        setUser({ ...data.user, token: data?.token });
        setIsAuthenticated(true);

        // Navigate to the Home screen
        router.replace("/(root)/(tabs)/delivery")
      } else {
        console.error("Invalid response structure:", data);
        alert("Login failed. Invalid response received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      setUser(null);
      setIsAuthenticated(false);

      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Provide context values
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
