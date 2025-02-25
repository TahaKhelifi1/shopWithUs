'use client';
import { Container, Title, Text, Card, Group, Button, Badge } from '@mantine/core';
import { gql, useQuery, useMutation } from '@apollo/client';
import AdminGuard from '@/app/components/AdminGuard';
import { useParams, useRouter } from 'next/navigation';

const GET_USER_WITH_ORDERS = gql`
  query GetUserWithOrders($userId: ID!) {
    getUser(id: $userId) {
      id
      prenom
      nom
      email
      orders {
        id
        date_commande
        status
        total_amount
        products {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

export default function UserOrders() {
    const params = useParams() as { id: string };
    const router = useRouter();
    const userId = params.id;

    const { data, refetch } = useQuery(GET_USER_WITH_ORDERS, {
        variables: { userId },
        skip: !userId
    });

    const [cancelOrder] = useMutation(CANCEL_ORDER, {
        onCompleted: () => refetch()
    });

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'PENDING': 'yellow',
            'COMPLETED': 'green',
            'CANCELLED': 'red',
            'PROCESSING': 'blue'
        };
        return colors[status] || 'gray';
    };

    return (
        <AdminGuard>
            <Container size="xl" py="xl">
                <Group justify="space-between" mb="xl">
                    <div>
                        <Title order={2} mb="xs">
                            Orders for {data?.getUser.prenom} {data?.getUser.nom}
                        </Title>
                        <Text color="dimmed">{data?.getUser.email}</Text>
                    </div>
                    <Button variant="light" onClick={() => router.back()}>
                        Back to Users
                    </Button>
                </Group>

                <div className="space-y-4">
                    {data?.getUser.orders.map((order: any) => (
                        <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
                            <Group justify="space-between" mb="md">
                                <div>
                                    <Group gap="md">
                                        <Text fw={500} size="lg">Order #{order.id}</Text>
                                        <Badge color={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" color="dimmed">
                                        Ordered on: {formatDate(order.date_commande)}
                                    </Text>
                                </div>
                                {order.status !== 'CANCELLED' && (
                                    <Button 
                                        color="red" 
                                        variant="light"
                                        onClick={() => cancelOrder({ variables: { id: order.id } })}
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </Group>

                            <div className="space-y-2">
                                {order.products.map((item: any) => (
                                    <Group key={item.id} justify="space-between">
                                        <Text size="sm">
                                            {item.product.name} x{item.quantity}
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </Group>
                                ))}
                            </div>

                            <Group justify="end" mt="md">
                                <Text fw={700}>
                                    Total: ${order.total_amount.toFixed(2)}
                                </Text>
                            </Group>
                        </Card>
                    ))}

                    {data?.getUser.orders.length === 0 && (
                        <Text color="dimmed" ta="center" py="xl">
                            This user has no orders yet.
                        </Text>
                    )}
                </div>
            </Container>
        </AdminGuard>
    );
} 