import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData(parsedUser);
      } catch (err) {
        console.error('Ошибка парсинга', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleEditToggle = () => setEditing(true);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/user/${user.User_id}`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
    }
  };

  if (!user) return <div className="profile-container">Загрузка профиля...</div>;

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>

      {editing ? (
        <>
          <input name="First_name" value={formData.First_name} onChange={handleChange} />
          <input name="Last_name" value={formData.Last_name} onChange={handleChange} />
          <input name="Email" value={formData.Email} onChange={handleChange} />
          <input name="City" value={formData.City} onChange={handleChange} />
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        </>
      ) : (
        <>
          <p><strong>Имя:</strong> {user.First_name} {user.Last_name}</p>
          <p><strong>Email:</strong> {user.Email}</p>
          <p><strong>Город:</strong> {user.City}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.Created_at).toLocaleDateString()}</p>
          <button className="edit-btn" onClick={handleEditToggle}>Редактировать</button>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>Выйти</button>
    </div>
  );
}

export default ProfilePage;
