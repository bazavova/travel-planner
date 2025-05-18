import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationList from '../components/RecommendationList';
import './ProfilePage.css';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [preferences, setPreferences] = useState(null);
  const [prefEditing, setPrefEditing] = useState(false);
  const [prefForm, setPrefForm] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData(parsedUser);
        fetchPreferences(parsedUser.User_id);
      } catch (err) {
        console.error('Ошибка парсинга', err);
      }
    }
  }, []);

  const fetchPreferences = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${userId}/preferences`);
      setPreferences(res.data);
      setPrefForm(res.data);
    } catch (err) {
      console.error('Ошибка загрузки предпочтений:', err);
    }
  };

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

  const handlePrefChange = (e) => {
    setPrefForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrefSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${user.User_id}/preferences`, prefForm);
      setPreferences(prefForm);
      setPrefEditing(false);
    } catch (err) {
      console.error('Ошибка при сохранении предпочтений:', err);
    }
  };

  const translateTravelType = (type) => {
    switch (type) {
      case 'nature': return 'Природа';
      case 'city': return 'Город';
      case 'shopping': return 'Шоппинг';
      case 'culture': return 'Культура';
      default: return type;
    }
  };

  const translateLanguage = (lang) => {
    switch (lang) {
      case 'ru': return 'Русский';
      case 'en': return 'Английский';
      default: return lang;
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

      {preferences && (
        <div className="preferences-block">
          <h3>Ваши предпочтения</h3>

          {prefEditing ? (
            <div className="pref-form">
              <label>
                Тип путешествия:
                <select name="Travel_type" value={prefForm.Travel_type} onChange={handlePrefChange}>
                  <option value="nature">Природа</option>
                  <option value="city">Город</option>
                  <option value="shopping">Шоппинг</option>
                  <option value="culture">Культура</option>
                </select>
              </label>

              <label>
                Язык общения:
                <select name="Language" value={prefForm.Language} onChange={handlePrefChange}>
                  <option value="ru">Русский</option>
                  <option value="en">Английский</option>
                </select>
              </label>

              <label>
                Бюджет (₽):
                <input type="number" name="Budget" value={prefForm.Budget} onChange={handlePrefChange} />
              </label>

              <label>
                Дополнительные пожелания:
                <textarea name="Other_preferences" value={prefForm.Other_preferences} onChange={handlePrefChange} />
              </label>

              <button className="save-btn" onClick={handlePrefSave}>Сохранить предпочтения</button>
            </div>
          ) : (
            <div className="pref-display">
              <p><strong>Тип путешествия:</strong> {translateTravelType(preferences.Travel_type)}</p>
              <p><strong>Язык общения:</strong> {translateLanguage(preferences.Language)}</p>
              <p><strong>Бюджет:</strong> {preferences.Budget.toLocaleString()} ₽</p>
              {preferences.Other_preferences && (
                <p><strong>Дополнительно:</strong> {preferences.Other_preferences}</p>
              )}
              <button className="edit-btn" onClick={() => setPrefEditing(true)}>Редактировать предпочтения</button>
            </div>
          )}
        </div>
      )}

      <RecommendationList userId={user.User_id} />
      <button className="logout-btn" onClick={handleLogout}>Выйти</button>
    </div>
  );
}

export default ProfilePage;
