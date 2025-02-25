'use client';
import {
    Container,
    Card,
    Group,
    Text,
    SimpleGrid,
    Title,
    ThemeIcon,
    Table,
    ActionIcon,
} from '@mantine/core';
import {
    IconUsers,
    IconPlaneDeparture,
    IconBuilding,
    IconReceipt,
    IconSun,
    IconMoon,
    IconBox,
} from '@tabler/icons-react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import AdminGuard from '@/app/components/AdminGuard';
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useMantineColorScheme } from '@mantine/core';
import AdminDashboard from '../dashboard/page';
import Link from 'next/link';

const GET_USERS = gql`
    query getUsers {
        getUsers {
            id
            prenom
            nom
        }
    }
`;

const GET_ALL_PRODUCTS = gql`
  query listProduct {
    listProduct {
      id
      name
      description
      price
      stock
      category
    }
  }
`;

const GET_ORDERS = gql`
  query getOrders {
    getOrders {
      id
      userId
      products {
        id
        name
        price
      }
      totalPrice
      status
      date
    }
  }
`;

interface DashboardOverviewProps {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
}

const DashboardOverview = ({ usersCount, productsCount, ordersCount }: DashboardOverviewProps) => {
    const stats = [
        { title: 'Total Users', value: usersCount, icon: IconUsers, color: 'yellow' },
        { title: 'Total Products', value: productsCount, icon: IconBox, color: 'teal' },
        { title: 'Total Orders', value: ordersCount, icon: IconReceipt, color: 'green' },
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {stats.map((stat) => (
                <Card key={stat.title} shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between">
                        <div>
                            <Text size="lg" c="dimmed" pb={20}>
                                {stat.title}
                            </Text>
                            <Title size="30px">{stat.value}</Title>
                        </div>
                        <ThemeIcon size={50} variant="light" color={stat.color}>
                            <stat.icon size="2rem" />
                        </ThemeIcon>
                    </Group>
                </Card>
            ))}
        </SimpleGrid>
    );
};

interface recentActivityProps {
    ordersData: any;
    usersData: any;
}

const RecentActivity = ({ ordersData, usersData }: recentActivityProps) => {
    const getUserById = (id: any) => usersData?.getUsers.find((user: { id: any; }) => user.id === id);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
                Recent Activity
            </Title>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Client</Table.Th>
                        <Table.Th>Order</Table.Th>
                        <Table.Th>Total Price</Table.Th>
                        <Table.Th>Date</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
    {ordersData?.getOrders.map((order: any, index: number) => {
        const user = getUserById(order.userId);

        return (
            <Table.Tr key={order.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>
                    {user ? (
                        <Link href={`/admin/users/${user.id}/orders`} className='text-blue-600 underline'>
                            {user.prenom} {user.nom}
                        </Link>
                    ) : (
                        <span className='text-gray-500'>Utilisateur inconnu</span>
                    )}
                </Table.Td>
                <Table.Td>{order.products.map((product: any) => product.name).join(', ')}</Table.Td>
                <Table.Td>{order.totalPrice} <sup>TND</sup></Table.Td>
                <Table.Td>{new Date(order.date).toLocaleDateString()}</Table.Td>
            </Table.Tr>
        );
    })}
</Table.Tbody>

            </Table>
        </Card>
    );
};

export default function Dashboard() {
    const params = useParams() as { id: string };
    const userId = params.id;
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const currentPath = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);
    const sidebarWidth = isMinimized ? '85px' : '270px';

    useEffect(() => {
        // Check for user data in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const { data: usersData } = useQuery(GET_USERS);
    const { data: productData } = useQuery(GET_ALL_PRODUCTS);
    const { data: ordersData } = useQuery(GET_ORDERS);


    const usersCount = usersData?.getUsers.length || 0;
    const productsCount = productData?.listProduct.length || 0;
    const ordersCount = ordersData?.getOrders.length || 0;

    useEffect(() => {
        // Check for user data in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, [usersData, productData, ordersData]);

    return (
        <div style={{ minHeight: '100vh', width: '100%' }}>
            <AdminDashboard>
                <AdminGuard>
                    {/* Main Content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1rem',
                        overflow: 'auto',
                        width: '100%'
                    }}>
                        <Container size="xl" style={{ flex: 1, minWidth: '100%' }} py="xl">
                            <div className='space-y-8' style={{ height: '100%' }}>
                                <DashboardOverview
                                    usersCount={usersCount}
                                    productsCount={productsCount}
                                    ordersCount={ordersCount}
                                />
                                <RecentActivity
                                    ordersData={ordersData}
                                    usersData={usersData}
                                />
                            </div>
                        </Container>
                    </div>
                </AdminGuard>
            </AdminDashboard>
        </div>
    );
}