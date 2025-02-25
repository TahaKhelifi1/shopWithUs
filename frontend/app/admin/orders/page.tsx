'use client';
import AdminGuard from '@/app/components/AdminGuard';
import AdminDashboard from '../dashboard/page';
import React, { useState } from 'react';
import { 
  Table,
  Group,
  Text,
  Select,
  TextInput,
  Button,
  Paper
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { gql, useQuery } from '@apollo/client';

const GET_ALL_ORDERS = gql`
  query ListOrders {
    listOrders {
      id
      userId
      productsId
      quantity
      totalPrice
      status
    }
  }
`;
export interface Order {
  id: string;
  customerName: string;
  email: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
} 

const OrderPage = () => {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // const getStatusColor = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
  //   const colors: { [key in 'pending' | 'processing' | 'completed' | 'cancelled']: string } = {
  //     pending: 'yellow',
  //     processing: 'blue',
  //     completed: 'green',
  //     cancelled: 'red',
  //   };
  //   return colors[status] || 'gray';
  // };

  // Handle loading and errors
  if (loading) return <Text>Loading orders...</Text>;
  if (error) return <Text color="red">Error loading orders: {error.message}</Text>;

  // Ensure data exists before filtering
  const filteredOrders = (data?.listOrders || []).filter((order: { id: string | string[]; userId: string | string[]; status: string; }) => {
    const matchesSearch =
      order.id.includes(search) || order.userId.includes(search);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <AdminDashboard>
        <AdminGuard>
          <div className="p-6">
            <div className="mb-6">
              <Text size="xl" fw={700} className="mb-4">
                Customer Orders
              </Text>
              
              <Paper className="p-4 mb-4">
                <Group>
                  <TextInput
                    placeholder="Search by order ID or user ID"
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    className="flex-1"
                    rightSection={<IconSearch size={16} />}
                  />
                  <Select
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    clearable
                    data={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                  />
                </Group>
              </Paper>

                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">Products ID</th>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                  <th className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order:any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{order.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{order.productsId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="-x-2 text-center " >
                        <button className="text-indigo-600 hover:text-indigo-900 text-center border border-indigo-600 px-2 py-1 text-sm">View Details</button>
                        <button className="text-blue-600 hover:text-blue-900 text-center border border-blue-600 px-2 py-1 text-sm ml-2">Update Status</button>
                    </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
                </table>
            </div>
          </div>
        </AdminGuard>
      </AdminDashboard>
    </>
  );
};

export default OrderPage;
