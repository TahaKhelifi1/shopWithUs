import { useState, useEffect } from 'react';
import { Product } from '@/product';

export function useCart() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from localStorage
    const getCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setLoading(false);
    };

    getCartItems();
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Add item to cart
  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return { cartItems, loading, addToCart, removeFromCart, clearCart };
}
