import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
    const router = useRouter();
    // Инициализируем состояние с типом string | null
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState({})


    useEffect(() => {
        // Получить токен доступа из локального хранилища
        const token = localStorage.getItem('access_token');
        setAccessToken(token);
        if (!token) {
            router.push('/');
        }
    }, [router]);


    return {
        accessToken
    };
};

export default useAuth;
