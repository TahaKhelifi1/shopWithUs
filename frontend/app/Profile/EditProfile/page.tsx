'use client';
import { gql, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Container, TextInput, PasswordInput, Button, Title, Text, Stack, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconCheck } from '@tabler/icons-react';




const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      prenom
      nom
      email
    }
  }
`;

export default function EditProfile() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.id);
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, []);

    const [updateUser, { loading }] = useMutation(UPDATE_USER, {
        onCompleted: (data) => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                localStorage.setItem('user', JSON.stringify({
                    ...user,
                    ...data.updateUser
                }));
            }
            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 2000);
        },
        onError: (error) => {
            setError(error.message);
            setSuccess(false);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.password || formData.confirmPassword) {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                }
            }

            const input: { nom: string; prenom: string; email: string; password?: string } = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
            };

            if (formData.password) {
                input.password = formData.password;
            }

            await updateUser({
                variables: {
                    id: userId,
                    input
                },
            });
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    return (
        <Container fluid className="min-h-screen flex items-center justify-center bg-white-800">
            <Container size="xs" className="bg-[#ffffff] p-8 rounded-lg shadow-lg w-full">
                <Stack gap="lg">
                    <div className="text-center">
                        <Title order={1} className="text-3xl font-bold text-[#fbbf24]">
                            Edit Profile
                        </Title>
                    </div>

                    {error && (
                        <Alert color="red" title="Error">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            color="green"
                            title="Success"
                            icon={<IconCheck size={16} />}
                        >
                            Profile updated successfully! Redirecting...
                        </Alert>
                    )}

                    <TextInput
                        label="First Name"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className="text-black"
                    />

                    <TextInput
                        label="Last Name"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="text-black"
                    />

                    <TextInput
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="text-black"
                    />

                    <PasswordInput
                        label="New Password (leave empty to keep current)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="text-black"
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="text-black"
                    />

                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading || success}
                        className="hover:bg-[#616162] bg-[#fbbf24] text-white transition-colors duration-200"
                    >
                        {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                    </Button>
                </Stack>
            </Container>
        </Container>
    );
}