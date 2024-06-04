import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../pages/api/axi';

function CreateTask() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm({
    
    defaultValues: {
      results: [["", ""]],
    },
  });

 
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: { title: string; description: string; results: string[][] }) => {
      const token = localStorage.getItem('access_token');
      return api.post('/tasks', data, {
        headers: {
          Authorization: `Bearer ${token}`, 'X-Requested-With': 'XMLHttpRequest'
        },
      });
    },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
        console.log('Задача успешно создана');
        queryClient.invalidateQueries('tasks');
      },
      onError: (error) => {
        console.error('Ошибка при создании задачи:', error);
      },
    }
  );

  const handleOk = handleSubmit((data) => {
    mutation.mutate({
      // @ts-ignore
      title: data.title,
      // @ts-ignore
      description: data.description,
      results: data.results,
    });
  });

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const inputStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    width: '100%',
    marginBottom: '10px',
  };

  const buttonStyle = {
    margin: '10px 0',
  };

  const resultsContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  };
  return (
    <div>
    <Button
        
      onClick={() => setIsModalOpen(true)}
      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-teal-500 flex justify-center items-center"
    >
        Создать задачу
    </Button>

      <Modal
        title="Создать задачу"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Создать"
        cancelText="Отменить"
      >
        <form>
          <div>
            <label>Название</label>
            <Controller
            // @ts-ignore
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                // @ts-ignore
                <input
                  id="title"
                  {...field}
                  type="text"
                  style={inputStyle}
                />
              )}
            />
          </div>

          <div className="mb-6">
            <label >Описание</label>
            <Controller
            // @ts-ignore
             name="description"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                // @ts-ignore
                <input
                  id="description"
                  {...field}
                  type="text"
                  style={inputStyle}
                />
              )}
            />
          </div>

          <Controller
            name="results"
            control={control}
            defaultValue={[]}
            rules={{ required: true }}
            render={({ field }) => (
              <div>
                {field.value.map((result, index) => (
                  <div key={index} style={resultsContainerStyle}>
                    <input
                      value={result[0]}
                      onChange={(e) => {
                        const newResults = [...field.value];
                        newResults[index][0] = e.target.value;
                        field.onChange(newResults);
                      }}
                      style={inputStyle}
                      type="text"
                      placeholder="Входные"
                    />
                    <input
                      value={result[1]}
                      onChange={(e) => {
                        const newResults = [...field.value];
                        newResults[index][1] = e.target.value;
                        field.onChange(newResults);
                      }}
                      style={inputStyle}
                      type="text"
                      placeholder="Выходные"
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    field.onChange([...field.value, ["", ""]]);
                  }}
                  style={buttonStyle}
                >
                  Добавить
                </Button>
              </div>
            )}
          />
        </form>
      </Modal>
    </div>
  );
}

export default CreateTask;
