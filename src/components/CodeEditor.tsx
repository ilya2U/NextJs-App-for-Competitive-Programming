

import React, { useRef, useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import givePoints from './givePoints';

interface ResultsProps {
    results: [string, string][];
    onAttempt: () => void;
    onWin: () => void;
}

const CodeEditorWithValidation: React.FC<ResultsProps> = ({ results, onAttempt, onWin }) => {
    const editorRef = useRef(null);
    const [testResults, setTestResults] = useState<(boolean | null)[]>(new Array(results.length).fill(null));
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    const initialCode = `
        function tryTask(inputData) {
            // inputData и output должны быть в формате string
            const output = "";
            // Напишите ваш код здесь
            return output;
        }
        `;

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const runCode =  async () => {
        const editor = editorRef.current;
        if (!editor) return;
        // @ts-ignore
        const userCode = editor.getValue();
        let userFunction;

        try {
            userFunction = new Function('inputData', `${userCode}\nreturn tryTask(inputData);`);
        } catch (error) {
            // @ts-ignore
            console.error('Ошибка в коде:', error.message);
            setTestResults(new Array(results.length).fill(false));
            setResultMessage('Провал');
            return;
        }

        const newTestResults = results.map(([input, expectedOutput], index) => {
            try {
                const actualOutput = userFunction(input);
                if (actualOutput !== expectedOutput) {
                    console.error(`Тест ${index + 1} провален: ожидалось ${expectedOutput}, получено ${actualOutput}`);
                    return false;
                } else {
                    console.log(`Тест ${index + 1} пройден.`);
                    return true;
                }
            } catch (error) {
                // @ts-ignore
                console.error(`Ошибка при выполнении теста ${index + 1}: ${error.message}`);
                return false;
            }
        });

        setTestResults(newTestResults);

        if (newTestResults.every(result => result)) {
            setResultMessage('Успешно');
            try {
                await givePoints();
            } catch (error) {
                console.error('Ошибка при начислении очков:', error);
            }
            onWin();
        } else {
            setResultMessage('Провал');
        }
    };

    useEffect(() => {
        if (resultMessage === 'Успешно') {
            onWin();
        }
    }, [resultMessage, onWin]);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1">
                <MonacoEditor
                    width="100%"
                    height="80%"
                    language="javascript"
                    theme="vs-light"
                    value={initialCode}
                    onMount={handleEditorDidMount}
                    options={{ minimap: { enabled: false } }}
                />
            </div>
            <div className="flex justify-center items-center m-4 space-x-4">
                <div className="flex space-x-2">
                    {testResults.map((result, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 rounded-full ${result === null ? 'bg-gray-500' : result ? 'bg-green-500' : 'bg-red-500'}`}
                        ></div>
                    ))}
                </div>
                <button
                    onClick={() => {
                        runCode();
                        onAttempt();
                    }}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Запустить тесты
                </button>
                {resultMessage && (
                    <span className={`ml-4 ${resultMessage === 'Успешно' ? 'text-green-500' : 'text-red-500'}`}>
                        {resultMessage}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CodeEditorWithValidation;