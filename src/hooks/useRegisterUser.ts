import { useMutation } from 'react-query';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { RegisterUserInput, RegisterUserResponse } from '@/types';
import api from '@/pages/api/axi';


const useRegisterUser = () => {
    const router = useRouter();
    return useMutation(
        async ({ avatar, hash, username }: RegisterUserInput): Promise<RegisterUserResponse> => {
            const response = await api.post<RegisterUserResponse>('/user', {
                avatar,
                hash,
                username,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                router.push('/tasks');
                // Сохраните токен доступа в localStorage после успешной регистрации
                localStorage.setItem('access_token', data.access_token);
            },
            onError: (error) => {
                // Обработайте ошибки при регистрации
                console.error('Ошибка регистрации:', error);
            },
        }
    );
};

export default useRegisterUser;
