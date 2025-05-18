import express from 'express';
import db from '../../db.js';

const router = express.Router();

// GET /api/attractions?city=Москва
router.get('/', (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'Город не указан' });
  }

  const query = `
  SELECT a.* FROM Attraction a
  JOIN City c ON a.City_id = c.City_id
  WHERE LOWER(c.City) = ?
  LIMIT 30
`;

  db.query(query, [city], (err, results) => {
    if (err) {
      console.error('Ошибка при получении достопримечательностей:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    res.json(results);
  });
});

export default router;
