'use client';
import React, { useEffect, useState } from 'react';
import { Table, Container, Title, Loader, Text } from '@mantine/core';
import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch orders by user
const GET__USER_ORDERS = gql`
  query GetOrdersByUser($userId: ID!) {
    getOrdersByUser(userId: $userId) {
      id
      userId
      productsId
      quantity
      totalPrice
      status
    }
  }
`;

// Define the Order interface based on the GraphQL query
interface Order {
  id: string;
  userId: string;
  productsId: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

function MyOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve userId from local storage or cookies


  // Fetch orders for the logged-in user
  const { loading, error, data } = useQuery(GET__USER_ORDERS, {
    variables: { userId },
    skip: !userId, // Skip query if userId is not available
  });

  // Update orders state when data is fetched
  useEffect(() => {
    if (data) {
      setOrders(data.getOrdersByUser);
    }
  }, [data]);

  // Show loading state
  if (loading) return <Loader size="xl" />;

  // Show error state
  if (error) return <Text color="red">Error: {error.message}</Text>;

  // Show message if no orders are found
  if (orders.length === 0) {
    return (
      <Container>
        <Title order={2} className="my-4">
          My Orders
        </Title>
        <Text>No orders found.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={2} className="my-4">
        My Orders
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Products ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.productsId}</td>
              <td>{order.quantity}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default MyOrderPage;