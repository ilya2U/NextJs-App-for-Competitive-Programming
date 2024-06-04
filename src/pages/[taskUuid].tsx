import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import api from './api/axi';
import CodeEditorWithValidation from '@/components/CodeEditor';
import { Modal } from 'antd';
import givePoints from '@/components/givePoints';

const Competition: React.FC = () => {
    const router = useRouter();
    const { taskUuid } = router.query;
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [opponentAttempts, setOpponentAttempts] = useState<number>(0);
    const [opponentStatus, setOpponentStatus] = useState<string | null>('В процессе');

    const fetchTask = async () => {
        const token = localStorage.getItem('access_token');
        const response = await api.get(`/tasks/${taskUuid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Requested-With': 'XMLHttpRequest'
            },
        });
        return response.data;
    };

    const { data, isLoading, isError } = useQuery(
        [`task${taskUuid}`],
        fetchTask,
        {
            enabled: !!taskUuid,
        }
    );

    useEffect(() => {
        if (taskUuid) {
            const socket = new WebSocket(`ws://localhost:8080/?taskId=${taskUuid}`);
            setWs(socket);

            socket.onopen = () => {
                console.log('WebSocket соединение установлено');
                socket.send(JSON.stringify({ event: 'ready' }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(`Получено сообщение: ${event.data}`);

                switch (data.event) {
                    case 'attempt':
                        setOpponentAttempts((prevAttempts) => prevAttempts + 1);
                        break;
                    case 'lose':
                        console.log('Оппонент выиграл');
                        setOpponentStatus('Поражение');
                        break;
                    case 'win':
                        console.log('Оппонент проиграл');
                        setOpponentStatus('Победа');
                        break;
                    case 'exit':
                        setOpponentStatus('Оппонент покинул');
                        break;
                    default:
                        console.log(`Неизвестное событие: ${data.event}`);
                        break;
                }
            };

            socket.onclose = () => {
                console.log('WebSocket соединение закрыто');
                setWs(null);
            };

            return () => {
                if (socket) {
                    socket.close();
                }
            };
        }
    }, [taskUuid]);

    const handleLogout = () => {
        router.push('/tasks');
        if (ws) {
            ws.send(JSON.stringify({ event: 'exit' }));
        }
    };

    const handleAttempt = () => {
        if (ws) {
            console.log('Отправка попытки');
            ws.send(JSON.stringify({ event: 'attempt', data: '' }));
        }
    };

    const handleWin =  () => {
        if (ws) {
            ws.send(JSON.stringify({ event: 'win' }));
            setOpponentStatus('Победа');
        }
    };
    

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (opponentStatus !== 'В процессе') {
            setShowModal(true);
            if (opponentStatus === 'Поражение') {
                setModalMessage('Вы проиграли');
                setTimeout(() => {
                    router.push('/tasks');
                }, 3000);
            } else if (opponentStatus === 'Оппонент покинул') {
                setModalMessage('Оппонент  вышел');
                setTimeout(() => {
                    router.push('/tasks');
                }, 3000);
            } else if (opponentStatus === 'Победа') {
                setModalMessage('Вы победили');
                setTimeout(() => {
                    router.push('/tasks');
                }, 3000);
            }

        }
    }, [opponentStatus, router]);


    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    if (isError) {
        return <p>Ошибка при загрузке задачи</p>;
    }

    if (!data || !data.title || !data.description) {
        return <p>Загрузка деталей задачи...</p>;
    }

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 flex justify-center">
                    <h1 className="text-2xl font-bold">{data.title}</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Выйти
                </button>
            </div>

            <p className="font-semibold">Описание:</p>
            <p className="mb-6">{data.description}</p>
            <div className="flex flex-1 flex-row w-full h-full">
                <div className="flex-1 border border-teал-600 rounded-md">
                    <CodeEditorWithValidation 
                        results={data.results} 
                        onAttempt={handleAttempt} 
                        onWin={handleWin} 
                    />
                </div>
                <div className="w-1/4 border border-teал-600 rounded-2xl p-5 ml-4">
                    <p className="font-semibold">Попытки оппонента:</p>
                    <p className="text-sm text-gray-700">{opponentAttempts}</p>
                </div>
                {showModal && (
                    <Modal
                        title="Результат соревнования"
                        visible={showModal}
                        footer={null} // Устанавливаем пустой футер
                    >
                        <p>{modalMessage}</p>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Competition;