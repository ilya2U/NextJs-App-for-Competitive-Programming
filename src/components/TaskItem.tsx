// import React from 'react';
// import { Modal, Card, Button } from 'antd';
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// interface TaskProps {
//   task: {
//     _id: string;
//     uuid: string;
//     title: string;
//     description: string;
//     results: any[]; // здесь можете уточнить тип данных для results
//     __v: number;
//   };
// }

// const TaskItem: React.FC<TaskProps> = ({ task }) => {
//   const router = useRouter();
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleProceed = () => {
//     router.push(`/${task.uuid}`);
//   };

//   const handleCardClick = () => {
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <>
//       <Card onClick={handleCardClick} style={{ width: '30%', margin: '10px' }} className='hover:bg-teal-600 hover:text-white'>
//         {task.title}
//       </Card>


//       <Modal
//           title={task.title}
//           visible={modalVisible}
//           onCancel={handleCloseModal}
//           footer={null}
//       >
//           <p>{task.description}</p>
//           {/* Оберните кнопку в контейнер для центровки по оси X */}
//           <div className="flex justify-center mt-4">
//               <Button  onClick={handleProceed} className='m-5 bg-teal-500 text-white'>
//                   Приступить
//               </Button>
//           </div>
//       </Modal>

//     </>
//   );
// };

// export default TaskItem;



import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Spin } from 'antd';
import { useRouter } from 'next/router';

interface TaskProps {
  task: {
    _id: string;
    uuid: string;
    title: string;
    description: string;
    results: any[]; // здесь можете уточнить тип данных для results
    __v: number;
  };
}

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'start') {
          // Начинаем задачу, когда второй человек подключится
          setWaiting(false);
          router.push(`/${task.uuid}`);
        }
      };

      ws.onclose = () => {
        console.log('Соединение закрыто');
        setWs(null);
      };
    }
  }, [ws, router, task.uuid]);

  const handleProceed = () => {
    if (!ws) {
      const socket = new WebSocket(`ws://localhost:8080/?taskId=${task.uuid}`);
      setWs(socket);

      socket.onopen = () => {
        socket.send(JSON.stringify({ event: 'ready' }));
        setWaiting(true);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWs(null);
      };
    }
  };

  const handleCardClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (ws) {
      ws.close();
    }
    setWaiting(false);
  };

  return (
    <>
      <Card onClick={handleCardClick} style={{ width: '30%', margin: '10px' }} className='hover:bg-teal-600 hover:text-white'>
        {task.title}
      </Card>

      <Modal
        title={task.title}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <p>{task.description}</p>
        <div className="flex justify-center mt-4">
          {waiting ? (
            <Spin tip="Ожидание второго участника..." />
          ) : (
            <Button onClick={handleProceed} className='m-5 bg-teal-500 text-white'>
              Приступить
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TaskItem;
