// components/AttractionCard.jsx
import React from 'react';
import './AttractionCard.css';

function AttractionCard({ name, description, lat, lon }) {
  return (
    <div className="attraction-card">
      <div className="attraction-header">
        <span role="img" aria-label="icon">🏛</span>
        <h4>{name}</h4>
      </div>
      {description && <p className="desc">{description}</p>}
      <p className="coords">📍 {lat.toFixed(4)}, {lon.toFixed(4)}</p>
    </div>
  );
}

export default AttractionCard;
