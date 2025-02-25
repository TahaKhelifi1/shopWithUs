'use client';

import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Stack,
  Text,
  Divider,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
        nom
        prenom
        email
        is_admin
      }
    }
  }
`;

export default function SignInPage() {
  const router = useRouter();
  const [signIn, { loading }] = useMutation(SIGN_IN);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { data } = await signIn({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      if (data.signIn.token) {
        localStorage.setItem('token', data.signIn.token);
        localStorage.setItem('user', JSON.stringify(data.signIn.user));

        notifications.show({
          title: 'Success',
          message: 'Signed in successfully!',
          color: 'green',
        });

        router.push('/admin/MainDashboard');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Invalid email or password',
        color: 'red',
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome Back
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account?{' '}
        <Link href="/auth/register" style={{ color: 'var(--mantine-color-blue-6)' }}>
          Sign up
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              {...form.getInputProps('email')}
            />
            {form.errors.email && <Text size="xs" c="red">{form.errors.email}</Text>}

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
            {form.errors.password && <Text size="xs" c="red">{form.errors.password}</Text>}

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              className="hover:bg-[#616162] bg-[#fbbf24] text-white transition-colors duration-200"
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="md">
          <Link href="/auth/forget_password" style={{ color: 'var(--mantine-color-blue-6)' }}>
            Forgot your password?
          </Link>
        </Text>

      </Paper>
    </Container>
  );
}
