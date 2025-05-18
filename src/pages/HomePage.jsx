import React, { useState, useEffect } from 'react';
import './HomePage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

registerLocale('ru', ru);

function HomePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    budget: '',
    travelType: '',
    language: '',
    guideRequired: false,
    transport: '', // добавлено поле транспорта
  });

  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/routes/destinations')
      .then(res => setDestinations(res.data))
      .catch(err => console.error('Ошибка загрузки направлений:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination: formData.destination,
      budget: formData.budget,
      travelType: formData.travelType,
      language: formData.language,
      guideRequired: formData.guideRequired,
      transport: formData.transport, // добавлен параметр транспорта
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="App">
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Найди путешествие своей мечты</h1>
            <p>Укажи направление, дату, язык и предпочтения</p>
          </div>

          <form className="travel-form" onSubmit={handleSubmit}>
            <label>
              Пункт назначения:
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
              >
                <option value="">Выбрать</option>
                {destinations.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label>
              Дата начала:
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                dateFormat="dd.MM.yyyy"
                locale="ru"
                placeholderText="дд.мм.гггг"
              />
            </label>

            <label>
              Дата окончания:
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                dateFormat="dd.MM.yyyy"
                locale="ru"
                placeholderText="дд.мм.гггг"
              />
            </label>

            <label>
              Бюджет (₽):
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              />
            </label>

            <label>
              Тип путешествия:
              <select
                name="travelType"
                value={formData.travelType}
                onChange={handleChange}
              >
                <option value="">Выбрать</option>
                <option value="nature">Природа</option>
                <option value="city">Город</option>
                <option value="shopping">Шоппинг</option>
                <option value="culture">Культура</option>
              </select>
            </label>

            <label>
              Язык:
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="">Выбрать</option>
                <option value="ru">Русский</option>
                <option value="en">Английский</option>
              </select>
            </label>

            <label>
              Транспорт:
              <select
                name="transport"
                value={formData.transport}
                onChange={handleChange}
              >
                <option value="">Выбрать</option>
                <option value="car">Автомобиль</option>
                <option value="plane">Самолёт</option>
                <option value="train">Поезд</option>
              </select>
            </label>

            <label className="checkbox-field">
              Нужен гид
              <input
                type="checkbox"
                name="guideRequired"
                checked={formData.guideRequired}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Найти маршрут</button>
          </form>
        </div>
      </div>

      <section className="recommendations">
        <h2>Рекомендуемые направления</h2>

        <div className="recommendation-block">
          <div className="recommendation-image" style={{ backgroundImage: "url('/images/stPiter.jpg')" }}></div>
          <div className="recommendation-text">
            <h3>Санкт Петербург</h3>
            <p>Город музеев, белых ночей и архитектурной роскоши на берегах Невы.</p>
          </div>
        </div>

        <div className="recommendation-block reverse">
          <div className="recommendation-image" style={{ backgroundImage: "url('/images/Kaliningrad.jpg')" }}></div>
          <div className="recommendation-text">
            <h3>Калининград</h3>
            <p>Европейский уют, немецкое наследие и Балтийская атмосфера в одном городе.</p>
          </div>
        </div>

        <div className="recommendation-block">
          <div className="recommendation-image" style={{ backgroundImage: "url('/images/Sochi.jpg')" }}></div>
          <div className="recommendation-text">
            <h3>Сочи</h3>
            <p>Чёрное море, горы, пальмы и круглогодичный курорт для активного отдыха.</p>
          </div>
        </div>
      </section>

      <div className="map-section">
        <iframe
          className="map-iframe"
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A2c1a59e4e26ea76b098004b8654e5f13f68d3eb21d08de9e738da4bfa5f071c4&amp;source=constructor"
          allowFullScreen
          title="Карта России"
        ></iframe>
      </div>
    </div>
  );
}

export default HomePage;
