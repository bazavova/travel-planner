import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(); // переход в основное приложение
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage('Ошибка при входе');
    }
  };

  return (
  <div className="auth-wrapper">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
      <button type="submit">Войти</button>
      {message && <p>{message}</p>}
      <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
    </form>
  </div>
);
}

export default LoginPage;
