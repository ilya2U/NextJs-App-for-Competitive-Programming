import useLoginUser from "@/hooks/useLoginUser";
import useRegisterUser from "@/hooks/useRegisterUser";
import { RegisterUserInput } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";



const AuthForm: React.FC = () => {
    
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterUserInput>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const registerUser = useRegisterUser();
    const loginUser = useLoginUser(); //  экземпляр useLoginUser
    

  
    const onRegister = (data: RegisterUserInput ) => {
      if (isRegistering) {
          registerUser.mutate({
              avatar: data.avatar,
              hash: data.hash,
              username: data.username,
          });
      } 
  };

  const onLogin = (data: RegisterUserInput) => {
    loginUser.mutate({
        hash: data.hash,
        username: data.username,
    },
     
    {    onError: (error) => {
            // Выводим сообщение об ошибке
            setErrorMessage('Неправильное имя пользователя или пароль');
            console.error('Ошибка авторизации:', error);
        }
    });
}

  const onSubmit = (data: RegisterUserInput) => {
    if (isRegistering) {
        onRegister(data);
    } else {
        onLogin(data);
    }
};

    return (
        
        <div className="max-w-md m-auto  p-4 bg-white shadow-md rounded mt-60">
            <h2 className="text-xl font-bold mb-4">{isRegistering ? 'Регистрация' : 'Авторизация'}</h2>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Controller
                    name="username"
                    control={control}
                    rules={{ required: 'Логин обязателен' }}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700">Логин:</label>
                            <input
                                id="username"
                                {...field}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="hash"
                    control={control}
                    rules={{
                        required: 'Пароль обязателен',
                        minLength: {
                            value: 6,
                            message: 'Пароль должен содержать минимум 6 символов',
                        },
                    }}
                    render={({ field }) => (
                        <div className="mb-4">
                            <label htmlFor="hash" className="block text-gray-700">Пароль:</label>
                            <input
                                id="hash"
                                {...field}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onFocus={() => setPasswordFocused(true)}
                            />
                            {(passwordFocused || errors.hash) && errors.hash && <p className="text-red-500">{errors.hash.message}</p>}
                        </div>
                    )}
                />

                {isRegistering && (
                    <Controller
                        name="avatar"
                        control={control}
                        rules={{ required: 'URL Картинки обязателен' }}
                        render={({ field }) => (
                            <div className="mb-4">
                                <label htmlFor="avatar" className="block text-gray-700">URL Картинки:</label>
                                <input
                                    id="avatar"
                                    {...field}
                                    type="url"
                                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.avatar && <p className="text-red-500">{errors.avatar.message}</p>}
                            </div>
                        )}
                    />
                )}


                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </form>

            {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>)
            }

            <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="mt-4 w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {isRegistering ? 'Назад к авторизации' : 'Зарегистрироваться'}
            </button>
        </div>

    );
};

export default AuthForm;
