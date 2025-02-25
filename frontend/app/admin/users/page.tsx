'use client';
import { Container, Title, Card, Text, Group, Button, TextInput, Modal, Stack, Switch, Badge } from '@mantine/core';
import { gql, useQuery, useMutation } from '@apollo/client';
import AdminGuard from '@/app/components/AdminGuard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import AdminDashboard from '@/app/admin/dashboard/page';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getUsers {
      id
      prenom
      nom
      email
      is_admin
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      prenom
      nom
      email
      is_admin
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation AdminResetPassword($userId: ID!, $newPassword: String!) {
    adminResetPassword(userId: $userId, newPassword: $newPassword) {
      id
    }
  }
`;

export default function AdminUsers() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const { data, refetch } = useQuery(GET_ALL_USERS);

    const [updateUser] = useMutation(UPDATE_USER, {
        onCompleted: () => {
            refetch();
            setIsEditModalOpen(false);
        }
    });

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: refetch
    });

    const [resetPassword] = useMutation(RESET_PASSWORD, {
        onCompleted: () => {
            setIsResetModalOpen(false);
            setNewPassword('');
        }
    });

    const filteredUsers = data?.getUsers.filter((user: any) =>
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateUser = async (userId: string, isAdmin: boolean) => {
        await updateUser({
            variables: {
                id: userId,
                input: { is_admin: isAdmin }
            }
        });
    };

    const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return;
        await resetPassword({
            variables: {
                userId: selectedUser.id,
                newPassword
            }
        });
    };

    return (
        <AdminDashboard>
            <AdminGuard>
                <Container size="xl" py="xl">
                    <Group justify="space-between" mb="xl">
                        <Title>Users Management</Title>
                        {/*<TextInput
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftSection={<IconSearch size="1.2rem" />}
                        />*/}
                    </Group>

                    <div className="space-y-4">
                        {filteredUsers?.map((user: any) => (
                            <Card key={user.id} shadow="sm" padding="lg" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Group gap="xs">
                                            <Text fw={500} size="lg">
                                                {user.prenom} {user.nom}
                                            </Text>
                                            {user.is_admin && (
                                                <Badge color="blue">Admin</Badge>
                                            )}
                                        </Group>
                                        <Text size="sm" color="dimmed">{user.email}</Text>
                                    </div>
                                    <Group>
                                        <Button
                                            variant="light"
                                            color="yellow"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsResetModalOpen(true);
                                            }}
                                        >
                                            Reset Password
                                        </Button>
                                        <Switch
                                            checked={user.is_admin}
                                            onChange={(e) => handleUpdateUser(user.id, e.currentTarget.checked)}
                                            label="Admin"
                                        />
                                        <Button
                                            color="red"
                                            variant="light"
                                            onClick={() => deleteUser({ variables: { id: user.id } })}
                                        >
                                            Delete
                                        </Button>
                                    </Group>
                                </Group>
                            </Card>
                        ))}
                    </div>

                    <Modal
                        opened={isResetModalOpen}
                        onClose={() => {
                            setIsResetModalOpen(false);
                            setNewPassword('');
                        }}
                        title="Reset Password"
                    >
                        <Stack>
                            <TextInput
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.currentTarget.value)}
                                type="password"
                            />
                            <Button onClick={handleResetPassword}>
                                Reset Password
                            </Button>
                        </Stack>
                    </Modal>
                </Container>
            </AdminGuard>
        </AdminDashboard>
    );
} 