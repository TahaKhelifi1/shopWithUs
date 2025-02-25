'use client';

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Container,
  Paper,
  Title,
  ActionIcon,
  Select,
} from "@mantine/core";
import { IconTrash } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const syncCart = (event: StorageEvent) => {
      if (event.key === "cart") {
        setCartItems(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showNotification({
      title: 'Item Removed',
      message: 'Item has been removed from your cart',
      color: 'red'
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleProceedToOrder = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("user") || "false");
    router.push(isLoggedIn ? "/order" : "/auth/signin");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    showNotification({ title: "Cart Cleared", message: "Your cart is now empty.", color: "red" });
  };

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.total, 0), [cartItems]);

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Title order={2} mb="xl" c="yellow">Shopping Cart</Title>
        
        {cartItems.length === 0 ? (
          <Group justify="center" mt="xl">
            <Text c="dimmed">Your cart is empty</Text>
            <Button component={Link} href="/product" color="yellow">
              Continue Shopping
            </Button>
          </Group>
        ) : (
          <>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cartItems.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>${item.price.toFixed(2)}</Table.Td>
                    <Table.Td>
                      <Select
                        value={String(item.quantity)}
                        onChange={(value) => value && updateQuantity(item.id, parseInt(value))}
                        data={[...Array(10)].map((_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
                        aria-label="Select quantity"
                      />
                    </Table.Td>
                    <Table.Td>${item.total.toFixed(2)}</Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        onClick={() => removeItem(item.id)}
                        variant="subtle"
                        aria-label="Remove item"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            
            <Group justify="space-between" mt="xl">
              <Text size="xl" fw={700}>Total: ${total.toFixed(2)}</Text>
              <Group>
                <Button color="red" variant="outline" onClick={clearCart}>Clear Cart</Button>
                <Button color="yellow" size="lg" onClick={handleProceedToOrder}>
                  Proceed to your order
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Paper>
    </Container>
  );
}