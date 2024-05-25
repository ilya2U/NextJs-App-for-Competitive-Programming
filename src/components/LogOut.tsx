import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';

const LogOut = () => {
    const router = useRouter();
    const handleLogout = () => {
        router.push('/')
        localStorage.removeItem("access_token")
    };
    return (
        
        <Button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center items-center"
        >
            Выйти
        </Button>
 
    
    );
};

export default LogOut;
