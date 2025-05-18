import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchRoutes();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Ошибка при получении пользователей:', err);
        }
    };

    const fetchRoutes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/routes');
            setRoutes(res.data);
        } catch (err) {
            console.error('Ошибка при получении маршрутов:', err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Удалить пользователя?')) {
            try {
                await axios.delete(`http://localhost:5000/api/user/${userId}`);
                fetchUsers();
            } catch (err) {
                console.error('Ошибка при удалении пользователя:', err);
            }
        }
    };

    const handleDeleteRoute = async (routeId) => {
        if (window.confirm('Удалить маршрут?')) {
            try {
                await axios.delete(`http://localhost:5000/api/routes/${routeId}`);
                fetchRoutes();
            } catch (err) {
                console.error('Ошибка при удалении маршрута:', err);
            }
        }
    };

    const translateType = (type) => {
        switch (type) {
            case 'nature': return 'Природа';
            case 'city': return 'Город';
            case 'shopping': return 'Шоппинг';
            case 'culture': return 'Культура';
            default: return type;
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Панель администратора</h2>

            <section>
                <h3>Пользователи</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Город</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.User_id}>
                                <td>{u.User_id}</td>
                                <td>{u.First_name} {u.Last_name}</td>
                                <td>{u.Email}</td>
                                <td>{u.City}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(u.User_id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section>
                <h3>Маршруты</h3>
                <button onClick={() => alert('Форма добавления маршрута (в разработке)')}>
                    ➕ Добавить маршрут
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Описание</th>
                            <th>Цена</th>
                            <th>Тип</th>
                            <th>Редактировать</th>
                            <th>Удалить</th>
                            <th>Бронирование</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map(route => (
                            <tr key={route.Route_id}>
                                <td>{route.Route_id}</td>
                                <td>{route.Description.slice(0, 50)}...</td>
                                <td>{route.Cost} ₽</td>
                                <td>{translateType(route.Travel_type)}</td>
                                <td><button onClick={() => alert('Редактирование в разработке')}>✏️</button></td>
                                <td><button onClick={() => handleDeleteRoute(route.Route_id)}>🗑️</button></td>
                                <td><button onClick={() => setShowModal(true)}>✅ Подтвердить</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Подтверждение бронирования (только визуально)</p>
                        <button onClick={() => setShowModal(false)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
