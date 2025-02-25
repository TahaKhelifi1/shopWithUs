'use client';
import { Container, Card, Menu, Button, Avatar, Group, Text, NavLink, ActionIcon } from '@mantine/core';
import { IconUser, IconCalendar,IconHome, IconLogout, IconBuildingSkyscraper, IconDoorExit, IconSettings, IconDashboard, IconPlane, IconChevronLeft, IconChevronRight, IconPackage, IconShoppingCart, IconCategory, IconReportMoney, IconTruck } from '@tabler/icons-react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import AdminGuard from '@/app/components/AdminGuard';
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
// import { maxHeaderSize } from 'http';



const GET_USER = gql`
    query getUser($userId: ID!) {
        getUser(id: $userId) {
            id
            prenom
            nom
        }
    }
`;



export default function AdminDashboard({ children }: { children: React.ReactNode }) {
    const params = useParams() as { id: string };
    const userId = params.id;
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        // Check for user data in localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);
    const currentPath = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    useQuery(GET_USER, {
        variables: { userId },
        skip: !userId
    });

    const sidebarWidth = isMinimized ? '85px' : '270px';

    return (
        
        <AdminGuard>
            <div style={{ display: 'flex' }}>
                <Card
                    shadow="sm"
                    padding="lg"
                    withBorder
                    style={{
                        width: sidebarWidth,
                        height: '100%',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        transition: 'width 0.3s ease',
                        overflow: 'visible',
                    }}
                >
                    <div style={{ position: 'absolute', right: '-15px', top: '20px' }}>
                        <ActionIcon
                            variant="variant"
                            bg={isMinimized ? 'yellow' : 'orange'}
                            onClick={() => setIsMinimized(!isMinimized)}
                            size={30}
                            style={{ zIndex: 1000, borderRadius: '50%' }}
                        >
                            {isMinimized ? <IconChevronRight size="1.2rem" /> : <IconChevronLeft size="1.2rem" />}
                        </ActionIcon>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', marginTop: '10px' }}>
                        <div className="space-y-2 font-[500]">
                            <NavLink
                                label={!isMinimized && "Dashboard" }
                                leftSection={<IconDashboard size="1.2rem" />}
                                active={currentPath === '/admin/MainDashboard'}
                                onClick={() => router.push('/admin/MainDashboard')}
                                color="yellow"
                            />
                            
                            <NavLink
                                label={!isMinimized && "Products"}
                                leftSection={<IconPackage size="1.2rem" />}
                                active={currentPath === '/admin/products'}
                                onClick={() => router.push('/admin/products')}
                                color="yellow"
                            />
                            <NavLink
                                label={!isMinimized && "Users"}
                                leftSection={<IconUser size="1.2rem" />}
                                active={currentPath === '/admin/users'}
                                onClick={() => router.push('/admin/users')}
                                color="yellow"
                            />
                            <NavLink
                                label={!isMinimized && "Orders"}
                                leftSection={<IconReportMoney size="1.2rem" />}
                                active={currentPath === '/admin/orders'}
                                onClick={() => router.push('/admin/orders')}
                                color="yellow"
                            />
                        </div>
                        <div className='font-[500]' style={{ position: 'absolute', bottom: '20px', width: '100%', left: 0, paddingLeft: '16px', paddingRight: '16px' }}>
                            <NavLink
                                label={!isMinimized && "Logout"}
                                leftSection={<IconDoorExit size="1.2rem" />}
                                onClick={() => handleLogout()}
                            />

                        </div>
                    </div>
                    <div className='mb-12' color="yellow">
                        <Menu>
                            <Menu.Target>
                                <Group>
                                    <Avatar color="yellow" radius="xl">
                                        {user?.prenom?.[0]}{user?.nom?.[0]}
                                    </Avatar>
                                    {!isMinimized &&  (
                                        <Text className='font-[500]'>{user?.prenom} {user?.nom}</Text>
                                        
                                    )}
                                </Group>

                            </Menu.Target>
                            <NavLink
                                className='font-[500]' 
                                style={{  bottom: '20px', width: '100%', left: 0, paddingLeft: '9px', paddingRight: '16px' }}
                                mt={20}
                                label={!isMinimized && "Home"}
                                leftSection={<IconHome size="1.3rem"  />}
                                onClick={() => router.push('/')}
                            />

                        </Menu>
                    </div>
                </Card>
                <div style={{ marginLeft: sidebarWidth, width: '100%', transition: 'margin-left 0.3s ease' }}>
                    <Container size="xl" py="xl">
                        {children}
                    </Container>
                </div>
            </div>
        </AdminGuard>
        
    );
}