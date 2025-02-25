'use client';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { Container, TextInput, PasswordInput, Button, Title, Text, Stack, Alert, Paper, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const REQUEST_RESET = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $code: String!, $newPassword: String!) {
    resetPassword(email: $email, code: $code, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const [requestReset, { loading: requestLoading }] = useMutation(REQUEST_RESET, {
        onCompleted: (data) => {
            if (data.forgotPassword.success) {
                setStep(2);
                setSuccess(data.forgotPassword.message);
            }
        },
        onError: (error) => setError(error.message)
    });

    const [resetPassword, { loading: resetLoading }] = useMutation(RESET_PASSWORD, {
        onCompleted: (data) => {
            if (data.resetPassword.success) {
                setSuccess('Password reset successfully! Redirecting...');
                setTimeout(() => router.push('/auth/signin'), 2000);
            }
        },
        onError: (error) => setError(error.message)
    });

    const handleRequestReset = async () => {
        setError('');
        setSuccess('');
        try {
            await requestReset({ variables: { email } });
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');
        try {
            await resetPassword({
                variables: { email, code, newPassword }
            });
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <Container size="xs" py="xl">
            <Paper shadow="sm" radius="md" p="xl" withBorder mt={100}>
                <Title order={2} mb="xl" c="yellow">Reset Password</Title>
                
                {error && (
                    <Alert color="red" title="Error">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="green" title="Success">
                        {success}
                    </Alert>
                )}

                {step === 1 ? (
                    <Stack gap="lg">
                        <TextInput
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <Button
                            onClick={handleRequestReset}
                            loading={requestLoading}
                            disabled={requestLoading}
                            color="yellow"
                        >
                            Request Reset Code
                        </Button>
                    </Stack>
                ) : (
                    <Stack gap="lg">
                        <TextInput
                            label="Reset Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter reset code"
                        />
                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <Button
                            onClick={handleResetPassword}
                            loading={resetLoading}
                            disabled={resetLoading}
                            color="yellow"
                        >
                            Reset Password
                        </Button>
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}