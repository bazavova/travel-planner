import express from 'express';
import db from '../../db.js';

const router = express.Router();

// 🔍 Поиск маршрутов по критериям
router.get('/search', (req, res) => {
  const { destination, budget, travelType, language, guideRequired } = req.query;

  let sql = 'SELECT * FROM Route WHERE 1=1';
  const values = [];

  if (destination) {
    sql += ' AND Destination LIKE ?';
    values.push(`%${destination}%`);
  }

  if (budget) {
    sql += ' AND Cost <= ?';
    values.push(Number(budget));
  }

  if (travelType) {
    sql += ' AND Travel_type = ?';
    values.push(travelType);
  }

  if (language) {
    sql += ' AND Language = ?';
    values.push(language);
  }

  if (guideRequired !== undefined) {
    sql += ' AND Guide_required = ?';
    values.push(guideRequired === 'true' ? 1 : 0);
  }

  db.query(sql, values, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при поиске маршрутов:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

// 📌 Получение всех маршрутов (для фильтрации на клиенте)
router.get('/', (req, res) => {
  const sql = `
    SELECT r.*, c.City AS Destination
    FROM Route r
    JOIN City c ON r.City_id = c.City_id
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении маршрутов:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
    res.json(rows);
  });
});

// 📍 Получение уникальных пунктов назначения, отсортированных по алфавиту
router.get('/destinations', (req, res) => {
  const sql = `
  SELECT DISTINCT c.City AS Destination
  FROM Route r
  JOIN City c ON r.City_id = c.City_id
  ORDER BY c.City
`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении направлений:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    const destinations = rows.map(r => r.Destination);
    res.json(destinations);
  });
});


export default router;
