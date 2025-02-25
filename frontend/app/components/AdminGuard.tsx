'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.is_admin) {
                setIsAdmin(true);
            } else {
                router.push('/');
            }
        } else {
            router.push('/auth/signin');
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? <>{children}</> : null;
} 