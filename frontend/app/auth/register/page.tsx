'use client';

import React from 'react';
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
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
         id
        nom
        prenom
        email
        is_admin
        token
    }
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nom: '',
      prenom: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      nom: (value) => (!value ? 'First name is required' : null),
      prenom: (value) => (!value ? 'Last name is required' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string; nom: string; prenom: string }) => {
    try {
      const { data } = await createUser({
        variables: {
          input: {
            email: values.email,
            password: values.password,
            nom: values.nom,
            prenom: values.prenom,
            is_admin: false,
          },
        },
      });
  
      if (data.createUser.token) {
        localStorage.setItem('token', data.createUser.token);  // ✅ Store token
        localStorage.setItem('user', JSON.stringify({         // ✅ Store user details
          id: data.createUser.id,
          email: data.createUser.email,
          nom: data.createUser.nom,
          prenom: data.createUser.prenom,
          is_admin: data.createUser.is_admin,
        }));
  
        notifications.show({
          title: 'Success',
          message: 'Account created successfully! Logging in...',
          color: 'green',
        });
  
        router.push('/product');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message:'Registration failed. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Create an Account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Link href="/auth/signin" style={{ color: 'var(--mantine-color-blue-6)' }}>
          Sign in
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="First Name"
              placeholder="Your first name"
              required
              {...form.getInputProps('nom')}
            />
            {form.errors.nom && <Text size="xs" c="red">{form.errors.nom}</Text>}

            <TextInput
              label="Last Name"
              placeholder="Your last name"
              required
              {...form.getInputProps('prenom')}
            />
            {form.errors.prenom && <Text size="xs" c="red">{form.errors.prenom}</Text>}

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

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />
            {form.errors.confirmPassword && <Text size="xs" c="red">{form.errors.confirmPassword}</Text>}

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              className="hover:bg-[#616162] bg-[#fbbf24] text-white transition-colors duration-200"
            >
              Create Account
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" mt="md">
          <Link href="/auth/forgot_password" style={{ color: 'var(--mantine-color-blue-6)' }}>
            Forgot your password?
          </Link>
        </Text>
      </Paper>
    </Container>
  );
}
