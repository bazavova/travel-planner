import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecommendationList.css';

function RecommendationList({ userId }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prefRes = await axios.get(`http://localhost:5000/api/user/${userId}/preferences`);
        const prefs = prefRes.data;

        const recRes = await axios.get('http://localhost:5000/api/recommendations', {
          params: {
            travelType: prefs.Travel_type,
            budget: prefs.Budget,
            language: prefs.Language
          }
        });

        setRecommendations(recRes.data);
      } catch (err) {
        console.error('Ошибка загрузки рекомендаций:', err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const getDuration = (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff;
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
    <div className="recommendations-section">
      <h3>Персональные рекомендации</h3>

      {recommendations.length === 0 ? (
        <p>Нет подходящих маршрутов</p>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map(route => (
            <li key={route.Route_id} className="recommendation-item">
              <div className="recommendation-content">
                <h4>{route.Description}</h4>
                <p>Город: {route.City_name}</p>
                <p>Тип маршрута: {translateType(route.Travel_type)}</p>
                <p>Цена: {route.Cost?.toLocaleString()} ₽</p>
                <p>Длительность: {getDuration(route.Start_date, route.End_date)} дней</p>
                <button className="book-btn">Забронировать</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendationList;
