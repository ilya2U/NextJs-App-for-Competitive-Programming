import api from '@/pages/api/axi';
import { Button } from 'antd';
import React, { useState } from 'react';

const DeleteTask = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Функция для удаления задачи
    const delTask = async (id:string) => {
        const token = localStorage.getItem('access_token');
        setIsLoading(true);
        try {
            const response = await api.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Задача успешно удалена:', response.data);
            // Выполните дополнительные действия после успешного удаления задачи, если это необходимо
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
            // Обработайте ошибку, если это необходимо
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик события для кнопки
    const handleDelete = () => {
        const taskId = "aa5a4e89-9255-40de-985f-311df2013979"; // Замените идентификатор задачи на нужный
        delTask(taskId);
    };

    return (
        <div>
            <Button onClick={handleDelete} loading={isLoading}>
                Удалить
            </Button>
        </div>
    );
};

export default DeleteTask;
