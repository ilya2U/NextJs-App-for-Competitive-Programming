
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import api from '../pages/api/axi';


const useLoginUser = () => {
    const router = useRouter();
    return useMutation(
        async ({ hash, username }: { hash: string; username: string }): Promise<any> => {
            const response = await api.post('/auth', {
                hash,
                username,
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                router.push('/tasks');
                localStorage.setItem('access_token', data.access_token);
            },
            onError: (error) => {
                // Handle registration errors
                console.error('Ошибка входа:', error);
            },
        }
    );
};

export default useLoginUser;