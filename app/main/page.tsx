'use client';
import { useEffect, useState } from "react";
import style from "./main.module.css";

interface DataItem {
    id: number;
    carName: string; // Название автомобиля
    price: string;    // Цена автомобиля
    isAvailable: boolean; // Доступность
}

export default function Page() {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newCarName, setNewCarName] = useState<string>('');
    const [newCarPrice, setNewCarPrice] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:44331/Car/carsList');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteCar = async (name: string) => {
        try {
            const response = await fetch(`https://localhost:44331/Car/deleteCar/${name}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the car');
            }
            // Обновляем локальное состояние после удаления
            setData((prevData) => prevData.filter(car => car.carName !== name));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    const addCar = async () => {
        try {
            const newCar = {
                carName: newCarName,
                price: newCarPrice,
                isAvailable: true,
            };

            const response = await fetch('https://localhost:44331/Car/addCar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCar),
            });

            if (!response.ok) {
                throw new Error('Failed to add the car');
            }

            // Проверка, если ответ является JSON
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                await response.json(); // Игнорируем результат, если он не нужен
            } else {
                console.warn("Response is not JSON:", await response.text());
            }

            // Перезагрузка данных после добавления нового автомобиля
            fetchData(); // Вызываем fetchData для обновления списка

            // Сброс полей формы
            setNewCarName('');
            setNewCarPrice('');
            setIsAdding(false); // Скрыть форму после добавления
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    // Функция для повторной загрузки данных
    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:44331/Car/carsList');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={style.goods}>
            <div className={style.grid}>
                {data.map(item => (
                    <div key={item.id} className={style["grid-item"]}>
                        <div className={style["text-container"]}>
                            <div>
                                IMAGE
                                {/* <img src={item.imageUrl} alt={item.title} /> */}
                            </div>
                            <div className={style.description}>
                                <h1>{item.carName}</h1>
                                <p>{item.price}</p>
                                <p>{item.isAvailable ? 'Доступен' : 'Недоступен'}</p>
                            </div>
                        </div>
                        <button onClick={() => deleteCar(item.carName)}>Удалить</button>
                    </div>
                ))}
            </div>
            <div className={style.option}>
                {isAdding ? (
                    <div className={style.addCarForm}>
                        <h2>Добавить новую машину</h2>
                        <input
                            type="text"
                            placeholder="Название машины"
                            value={newCarName}
                            onChange={(e) => setNewCarName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Цена"
                            value={newCarPrice}
                            onChange={(e) => setNewCarPrice(e.target.value)}
                        />
                        <button onClick={addCar}>Добавить</button>
                        <button onClick={() => setIsAdding(false)}>Отмена</button>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)}>Добавить машину</button>
                )}
            </div>
        </div>
    );
}
