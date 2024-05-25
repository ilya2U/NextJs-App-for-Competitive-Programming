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

        // Если токен отсутствует, редирект на страницу регистрации
        if (!token) {
            router.push('/');
        }
    }, [router]);



    // Вернуть текущий токен доступа и функцию выхода
    return {
        accessToken
    };
};

export default useAuth;
