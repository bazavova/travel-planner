import express from 'express';
import db from '../../db.js';

const router = express.Router();

// GET /api/recommendations?travelType=&budget=&language=
router.get('/', (req, res) => {
  const { travelType, budget, language } = req.query;

  const sql = `
  SELECT r.*, c.City AS City_name
  FROM route r
  JOIN city c ON r.City_id = c.City_id
  WHERE 
    (? IS NULL OR r.Travel_type = ?)
    AND (? IS NULL OR r.Cost <= ?)
    AND (? IS NULL OR r.Language = ?)
  ORDER BY r.Cost ASC
  LIMIT 10
`;

const values = [
  travelType, travelType,
  budget, budget,
  language, language
];

  db.query(sql, values, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении рекомендаций:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

export default router;
