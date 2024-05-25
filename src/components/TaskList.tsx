import React from 'react'
import TaskItem from './TaskItem';
import api from '@/pages/api/axi';
import { useQuery } from 'react-query';
import { TaskI } from '@/types';


const fetchTasks = async () => {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/tasks', { headers: { 'Authorization': `Bearer ${token}`,'X-Requested-With': 'XMLHttpRequest' } });
    return response.data;
};


  
const TaskList : React.FC = () => {

    const { data, isLoading, isError } = useQuery(['tasks'], fetchTasks, {
        initialData: [], // Optional initial data while fetching
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching tasks</p>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data?.map((task: TaskI) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      );
}

export default TaskList