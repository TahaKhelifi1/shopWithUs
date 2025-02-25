import { useState, useEffect } from 'react';



export function useCart() {
  const [cartItems, setCartItems] = useState<[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get cart items from localStorage or your API
    const getCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setLoading(false);
    };

    // Clear cart for each logged-in user
    const clearCartForUser = () => {
      localStorage.removeItem('cart');
      setCartItems([]);
    };

    getCartItems();
    clearCartForUser();
  }, []);

  return { cartItems, loading };
}