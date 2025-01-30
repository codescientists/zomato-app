import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import Toast from "react-native-toast-message";
import { useDebouncedCallback } from "use-debounce";

interface CartItem {
  _id: string;
  restaurantId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  restaurant: {
    _id: string
  };
  items: CartItem[];
}

interface CartContextType {
  carts: Cart[];
  cartLoading: boolean;
  cartError: string | null;
  addItemToCart: (
    restaurantId: string,
    itemId: string,
    name: string,
    price: number,
    quantity: number
  ) => Promise<void>;
  removeItemFromCart: (restaurantId: string, itemId: string) => Promise<void>;
  clearCart: (restaurantId: string) => void;
  increaseQuantity: (restaurantId: string, itemId: string, quantity: number) => void;
  decreaseQuantity: (restaurantId: string, itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  // Fetch all carts on context load
  useEffect(() => {
    const fetchCarts = async () => {
      setCartLoading(true);
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/carts`,
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch carts");
        }

        const data = await response.json();
        console.log("CART DATA -> ", data)
        setCarts(data.carts || []);
      } catch (error: any) {
        setCartError(error.message);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCarts();
  }, []);


  // Add an item to the cart of a specific restaurant
  const addItemToCart = async (
    restaurantId: string,
    itemId: string,
    name: string,
    price: number,
    quantity: number
  ) => {
    setCartLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/carts/${restaurantId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            restaurantId,
            menuItemId: itemId,
            name,
            price,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();

      setCarts((prevCarts) => {
        const existingCart = prevCarts.find(
          (cart) => cart.restaurant._id === restaurantId
        );

        if (existingCart) {
          return prevCarts.map((cart) =>
            cart.restaurant._id === restaurantId
              ? {
                ...data?.cart,
              }
              : cart
          );
        } else {
          return [...prevCarts, { ...data?.cart }];
        }
      });

    } catch (error: any) {
      setCartError(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  // Remove an item from a specific restaurant's cart
  const removeItemFromCart = async (restaurantId: string, itemId: string) => {
    setCartLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/cart/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCarts((prevCarts) =>
        prevCarts.map((cart) =>
          cart.restaurant._id === restaurantId
            ? {
              ...cart,
              items: cart.items.filter((item) => item._id !== itemId),
            }
            : cart
        )
      );
    } catch (error: any) {
      setCartError(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  // Clear the cart of a specific restaurant
  const clearCart = (restaurantId: string) => {
    setCarts((prevCarts) =>
      prevCarts.filter((cart) => cart.restaurant._id !== restaurantId)
    );
  };



  // Function to update cart state
  const updateCartState = (restaurantId: string, itemId: string, quantity: number, setCarts: any) => {
    setCarts((prevCarts: any) =>
      prevCarts.map((cart: any) =>
        cart.restaurant._id === restaurantId
          ? {
            ...cart,
            items: cart.items.map((item: any) =>
              item._id === itemId ? { ...item, quantity } : item
            ),
          }
          : cart
      )
    );
  };

  // API call for increasing quantity (debounced)
  const debouncedIncreaseQuantity = useDebouncedCallback(async (restaurantId: string, itemId: string, quantity: number, setCarts: any) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/carts/${restaurantId}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quantity
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        updateCartState(restaurantId, itemId, quantity, setCarts);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  }, 1000); // 500ms debounce delay

  // API call for decreasing quantity (debounced)
  const debouncedDecreaseQuantity = useDebouncedCallback(async (restaurantId: string, itemId: string, quantity: number, setCarts: any) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/carts/${restaurantId}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quantity
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        updateCartState(restaurantId, itemId, quantity, setCarts);
      }

    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  }, 1000); // 500ms debounce delay

  // Increase quantity function
  const increaseQuantity = (restaurantId: string, itemId: string, quantity: number) => {
    updateCartState(restaurantId, itemId, quantity, setCarts); // Optimistic UI update
    debouncedIncreaseQuantity(restaurantId, itemId, quantity, setCarts);
  };

  // Decrease quantity function
  const decreaseQuantity = (restaurantId: string, itemId: string, quantity: number) => {
    updateCartState(restaurantId, itemId, quantity, setCarts); // Prevent quantity from going below 1
    debouncedDecreaseQuantity(restaurantId, itemId, quantity, setCarts);
  };


  return (
    <CartContext.Provider
      value={{
        carts,
        cartLoading,
        cartError,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for consuming the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
