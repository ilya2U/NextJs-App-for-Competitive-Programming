import React from 'react';
import api from './api/axi';
import { useQuery } from 'react-query';
import { Button } from 'antd'; // Импортируем компонент Button из antd
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router'; // Импортируем useRouter из next/router
import useAuth from '@/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';


interface UserCardData {
    username: string;
    avatar: string;
    points: number;
}

const fetchUserCard = async () => {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/auth/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

const Points = () => {
    useAuth()
    const { data: userCardData } = useQuery(['userCard'], fetchUserCard);
    const currentName = userCardData?.username;
    const router = useRouter(); // Инициализируем useRouter

    const fetchPointTable = async () => {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/user/points`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
        });
        return response.data;
    };

    const { data: pointTableData, isLoading, isError } = useQuery(
        ['pointsList'],
        fetchPointTable,
    );

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (isError) {
        return <p>Ошибка при загрузке задачи</p>;
    }

    if (!pointTableData) {
        return <p>Загрузка рейтинга игроков</p>;
    }

    const currentUserIndex = pointTableData.findIndex((user: any) => user.username === currentName);

    return (
        <div className="p-4 flex flex-col min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    <span className="p-3 bg-teal-600 rounded text-white inline-block">Таблица рекордов</span>
                </h1>

               
                <Button
                    onClick={() => router.push('/tasks')}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-teal-500 flex justify-center items-center"
                >
                    Вернуться к списку задач
                </Button>
            </div>
            <p className="text-lg mb-4">
                <span className="p-3 bg-teal-600 text-white rounded inline-block">Твое место: {currentUserIndex + 1}</span>
            </p>
            <div className="bg-white shadow rounded-lg p-4 flex-grow">
                {pointTableData.map((user: any, index: number) => (
                    <div
                        key={user._id}
                        className={`p-2 rounded mb-2 flex justify-between items-center ${index < 1 ? 'bg-yellow-200' : 'bg-gray-100'}`}
                    >
                        <span className="font-bold">{index + 1}</span>
                        <span className="ml-2">
                            {user.username}
                            {index === 0 && <span className="ml-2 text-sm text-red-500">  <FontAwesomeIcon icon={faTrophy} className="mx-1" /> Мы гордимся тобой, Чемпион</span>}
                        </span>
                        <span className="ml-auto">{user.points}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Points;
