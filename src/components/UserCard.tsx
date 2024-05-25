
import React from 'react';
import { useQuery } from 'react-query';
import { Image, Spin } from 'antd';
import api from '../pages/api/axi';

const UserCard = () => {
    // Функция для получения данных о пользователе
    const fetchUserCard = async () => {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/auth/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    };

    // Хук useQuery для запроса данных о пользователе
    const { data, isLoading, isError } = useQuery(['userCard'], fetchUserCard);

    // Обработка состояний загрузки и ошибки
    if (isLoading) return <Spin>Loading...</Spin>;
    if (isError) return <div>Error loading user data</div>;

    return (
        <div className="flex flex-row p-3 items-center">
        {data.avatar && (
            <Image src={data.avatar} alt="User Avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        )}
            <div className='p-2 rounded'>
                <span className="border bg-teal-600 text-white rounded  p-2">
                    {data.username}
                </span>
            </div>
        </div>
    
    );
};

export default UserCard;
