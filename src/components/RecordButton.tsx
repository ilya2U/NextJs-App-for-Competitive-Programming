import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';

const RecordButton = () => {
    const router = useRouter();
    const handleRec = () => {
        router.push('/points')
    };
    return (
        
        <Button
            onClick={handleRec}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center items-center"
        >
            Таблица Рекордов
        </Button>
 
    
    );
};

export default RecordButton;
