import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TripsPage.css';

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    Destination: '',
    Start_date: '',
    End_date: '',
    Cost: '',
    Guide_required: false
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.User_id) {
      axios.get(`http://localhost:5000/api/trips/user/${user.User_id}`)
        .then(res => setTrips(res.data))
        .catch(err => console.error('Ошибка при получении списка поездок:', err));
    }
  }, []);

  const handleDelete = (tripId) => {
    if (window.confirm('Удалить эту поездку?')) {
      axios.delete(`http://localhost:5000/api/trips/${tripId}`)
        .then(() => setTrips(prev => prev.filter(trip => trip.Trip_id !== tripId)))
        .catch(err => console.error('Ошибка при удалении поездки:', err));
    }
  };

  const handleEditClick = (trip) => {
    setEditingTrip(trip);
    setFormData({
      Destination: trip.Destination,
      Start_date: trip.Start_date.slice(0, 10),
      End_date: trip.End_date.slice(0, 10),
      Cost: trip.Cost,
      Guide_required: trip.Guide_required
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/trips/${editingTrip.Trip_id}`, formData)
      .then(() => {
        setTrips(prev => prev.map(trip => trip.Trip_id === editingTrip.Trip_id ? { ...trip, ...formData } : trip));
        setEditingTrip(null);
      })
      .catch(err => console.error('Ошибка при сохранении изменений:', err));
  };

  return (
    <div className="trips-page">
      <h2 className="trips-heading">Ваши забронированные путешествия</h2>
      {trips.length > 0 ? (
        <ul className="trip-list">
          {trips.map((trip) => (
            <li key={trip.Trip_id} className="trip-item">
              <p><strong>🌍 Направление:</strong> {trip.Destination}</p>
              <p><strong>📅 С:</strong> {new Date(trip.Start_date).toLocaleDateString()}</p>
              <p><strong>📅 По:</strong> {new Date(trip.End_date).toLocaleDateString()}</p>
              <p><strong>💰 Бюджет:</strong> {trip.Cost} ₽</p>
              <p><strong>🧭 Гид:</strong> {trip.Guide_required ? 'Да' : 'Нет'}</p>
              <div className="trip-actions">
                <button className="edit-btn" onClick={() => handleEditClick(trip)}>Редактировать</button>
                <button className="delete-btn" onClick={() => handleDelete(trip.Trip_id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-trips">У вас пока нет поездок. Запланируйте первую!</p>
      )}

      {editingTrip && (
        <div className="modal">
          <div className="modal-content">
            <h3>Редактирование поездки</h3>
            <input name="Destination" value={formData.Destination} onChange={handleChange} placeholder="Направление" />
            <input name="Start_date" type="date" value={formData.Start_date} onChange={handleChange} />
            <input name="End_date" type="date" value={formData.End_date} onChange={handleChange} />
            <input name="Cost" type="number" value={formData.Cost} onChange={handleChange} placeholder="Бюджет" />
            <label>
              <input name="Guide_required" type="checkbox" checked={formData.Guide_required} onChange={handleChange} /> Нужен гид
            </label>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setEditingTrip(null)}>Отмена</button>
              <button className="save-btn" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripsPage;
