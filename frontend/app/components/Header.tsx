'use client';
import { Group, AppShell, Container, Button, Text, Burger, Drawer, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

import { IconLogout, IconUser, IconSettings, IconShoppingCart, IconDashboard } from '@tabler/icons-react';

function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <AppShell p={0}>
            <Container fluid className="bg-gradient-to-r from-green-50 to-green-100 shadow-md">
                <Group justify="space-between" w="100%" h="100%" px="md" py="xs">
                    <Group>
                        <Link href="/">
                            <Text
                                size="xl"
                                fw={700}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                            >
                                ShopWithUs
                            </Text>
                        </Link>
                    </Group>

                    {/* Desktop Navigation */}
                    <Group visibleFrom="sm" gap="xl">
                        <Link href="/">
                            <Text
                                fw={500}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                className="hover:text-green-500 transition-all duration-300 relative group"
                            >
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </Text>
                        </Link>

                        <Link href="/product">
                            <Text
                                fw={500}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                className="hover:text-green-500 transition-all duration-300 relative group"
                            >
                                Shop
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </Text>
                        </Link>
                        <Link href="/cart">
                            <Text
                                fw={500}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                className="hover:text-green-500 transition-all duration-300 relative group"
                            >
                                Cart
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </Text>
                        </Link>

                        <Link href="/contactUs">
                            <Text
                                fw={500}
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                className="hover:text-green-500 transition-all duration-300 relative group"
                            >
                                Contact Us
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                            </Text>
                        </Link>
                        {user ? (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Button variant="subtle">
                                        <Group>
                                            <Avatar color="green" radius="xl">
                                                {user.prenom?.[0]}{user.nom?.[0]}
                                            </Avatar>
                                            <Text style={{ fontFamily: '"Poppins", sans-serif' }}>
                                                {user.prenom} {user.nom}
                                            </Text>
                                        </Group>
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<IconUser size={14} />}
                                        onClick={() => router.push('/Profile')}
                                        style={{ fontFamily: '"Cairo", sans-serif' }}
                                    >
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconSettings size={14} />}
                                        onClick={() => router.push('/Profile/EditProfile')}
                                        style={{ fontFamily: '"Cairo", sans-serif' }}
                                    >
                                        Edit Profile
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconShoppingCart size={14} />}
                                        onClick={() => router.push('/Myorder')}
                                        style={{ fontFamily: '"Cairo", sans-serif' }}
                                    >
                                        My Orders
                                    </Menu.Item>
                                    {user.is_admin && (
                                        <Menu.Item
                                            leftSection={<IconDashboard size={14} />}
                                            onClick={() => router.push('/admin/MainDashboard')}
                                            style={{ fontFamily: '"Cairo", sans-serif' }}
                                        >
                                            Admin Dashboard
                                        </Menu.Item>
                                    )}
                                    <Menu.Divider />
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconLogout size={14} />}
                                        onClick={handleLogout}
                                        style={{ fontFamily: '"Cairo", sans-serif' }}
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <>
                                <Link href="/auth/signin">
                                    <Button
                                        variant="light"
                                        className="hover:bg-green-100 transition-all duration-300"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button
                                        variant="filled"
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Group>
                    {/* Mobile Navigation */}
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
                    <Drawer
                        opened={opened}
                        onClose={toggle}
                        size="60%"
                        padding="md"
                        hiddenFrom="sm"
                        title={
                            <Text
                                size="xl"
                                fw={700}
                                style={{ fontFamily: '"Cairo", sans-serif' }}
                                className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                            >
                                ShopWithUs
                            </Text>
                        }
                    >
                        <div className="flex flex-col gap-6 mt-8">
                            <Link href="/" onClick={toggle}>
                                <Text
                                    fw={500}
                                    style={{ fontFamily: '"Cairo", sans-serif' }}
                                    className="text-lg hover:text-green-500 transition-all duration-300"
                                >
                                    Home
                                </Text>
                            </Link>
                            <Link href="/shop" onClick={toggle}>
                                <Text
                                    fw={500}
                                    style={{ fontFamily: '"Cairo", sans-serif' }}
                                    className="text-lg hover:text-green-500 transition-all duration-300"
                                >
                                    Shop
                                </Text>
                            </Link>
                            <Link href="/cart" onClick={toggle}>
                                <Text
                                    fw={500}
                                    style={{ fontFamily: '"Cairo", sans-serif' }}
                                    className="text-lg hover:text-green-500 transition-all duration-300"
                                >
                                    Cart
                                </Text>
                            </Link>
                            <Link href="/auth/signin">
                                <Button
                                    variant="light"
                                    onClick={toggle}
                                    className="hover:bg-green-100 transition-all duration-300"
                                    size="lg"
                                    fullWidth
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button
                                    variant="filled"
                                    onClick={toggle}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300"
                                    size="lg"
                                    fullWidth
                                >
                                    Register
                                </Button>
                            </Link>
                        </div>
                    </Drawer>
                </Group>
            </Container>
        </AppShell>
    );
}

export default Header;
