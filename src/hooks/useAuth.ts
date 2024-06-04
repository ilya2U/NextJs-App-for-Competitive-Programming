import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/pages/api/axi';

const useAuth = () => {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null); // Предполагается, что объект пользователя может быть любого типа. Настройте это при необходимости.

    const getUser = async (token: string | null) => {
        if (token) {
            try {
                const response = await api.get('/auth/user', { headers: { 'Authorization': `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest' } });
                return response.data;
            } catch (error) {
                console.error('Не удалось получить пользователя:', error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            setAccessToken(token);
            if (!token) {
                router.push('/');
            } else {
                const fetchedUser = await getUser(token);
                setUser(fetchedUser);
            }
        };

        fetchUser();
    }, [router]);

    return {
        accessToken,
        user
    };
};

export default useAuth;
