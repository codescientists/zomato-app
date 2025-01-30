import { AuthProvider } from "@/context/authContext";
import "./global.css";
import { Stack } from "expo-router";
import { CartProvider } from "@/context/cartContext";
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return <AuthProvider>
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </CartProvider>
  </AuthProvider>
}
