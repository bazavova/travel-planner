import React from 'react';
import './SearchPage.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SearchPage() {
  const location = useLocation();
  const [routes, setRoutes] = useState([]);

  const params = new URLSearchParams(location.search);
  const destination = (params.get('destination') || '').trim().toLowerCase();
  const budget = parseFloat(params.get('budget')) || 0;
  const travelType = params.get('travelType') || '';
  const language = params.get('language') || '';
  const guideRequired = params.get('guideRequired') === 'true';

  useEffect(() => {
    axios.get('http://localhost:5000/api/routes')
      .then(res => {
        const filtered = res.data.filter(route => {
          return (
            (!destination || route.Destination.toLowerCase().includes(destination)) &&
            (!budget || parseFloat(route.Cost) <= budget) &&
            (!travelType || route.Travel_type === travelType) &&
            (!language || route.Language === language) &&
            (!guideRequired || route.Guide_required)
          );
        });
        setRoutes(filtered);
      })
      .catch(err => console.error('Ошибка загрузки маршрутов', err));
  }, [destination, budget, travelType, language, guideRequired]);

  const translateType = type => {
    const map = {
      nature: 'Природа',
      city: 'Город',
      shopping: 'Шоппинг',
      culture: 'Культура'
    };
    return map[type] || type;
  };

  const translateLang = lang => {
    const map = {
      ru: 'Русский',
      en: 'Английский'
    };
    return map[lang] || lang;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const handleBook = async (route) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = {
      destination: route.Destination,
      startDate: route.Start_date,
      endDate: route.End_date,
      cost: parseFloat(route.Cost),
      guideRequired: route.Guide_required,
      userId: user?.User_id,
      guideId: 1,
      travelType: route.Travel_type,
      language: route.Language,
    };

    try {
      await axios.post('http://localhost:5000/api/trips', payload);
      alert('Маршрут забронирован и добавлен в "Поездки"');
    } catch (err) {
      console.error('Ошибка бронирования', err);
    }
  };

  return (
    <div className="search-page">
      <h2>Результаты поиска</h2>
      <div className="route-list">
        {routes.map(route => (
          <div key={route.Route_id} className="route-card">
            <h3>{route.Destination}</h3>
            <p><strong>📅 Даты:</strong> {formatDate(route.Start_date)} — {formatDate(route.End_date)}</p>
            <p><strong>💰 Бюджет:</strong> {parseFloat(route.Cost).toFixed(2)} ₽</p>
            <p><strong>🧭 Тип:</strong> {translateType(route.Travel_type)}</p>
            <p><strong>🌐 Язык:</strong> {translateLang(route.Language)}</p>
            <p><strong>🧑‍🏫 Гид:</strong> {route.Guide_required ? 'Да' : 'Нет'}</p>
            <button onClick={() => handleBook(route)}>Забронировать</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
