// hotels.js — версия с query (без execute) для mysql
import express from 'express';
import db from '../../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const cityParam = decodeURIComponent(req.query.city || '').trim();
  const city = cityParam.toLowerCase();

  console.log('🌐 Запрошен город:', city);

  db.query(
    `SELECT h.* FROM Hotel h
     JOIN City c ON h.City_id = c.City_id
     WHERE LOWER(c.City) = ?
     LIMIT 20`,
    [city],
    (err, rows) => {
      if (err) {
        console.error('❌ Ошибка при получении отелей:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      console.log('📦 Найдено отелей:', rows.length);

      if (!rows.length) {
        console.warn('⚠️ Отели не найдены для города:', city);
      }

      res.json(rows);
    }
  );
});

export default router;
