// components/HotelCard.jsx
import React from 'react';
import './HotelCard.css';

function HotelCard({ name, price, rating, description }) {
  return (
    <div className="hotel-card">
      <h4>🏨 {name}</h4>
      <p><strong>Цена:</strong> {Number(price).toFixed(2)} ₽</p>
      <p><strong>Рейтинг:</strong> ⭐ {Number(rating).toFixed(1)} / 5</p>
      {description && <p className="desc">{description}</p>}
    </div>
  );
}

export default HotelCard;
