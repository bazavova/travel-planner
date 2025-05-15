import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Добавление новой поездки
router.post('/', (req, res) => {
  const { destination, startDate, endDate, cost, guideRequired, userId, guideId } = req.body;

  const sql = `
    INSERT INTO trip (Start_date, End_date, Destination, Guide_required, Cost, User_id, Guide_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [startDate, endDate, destination, guideRequired, cost, userId, guideId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Ошибка при добавлении поездки:', err);
      return res.status(500).json({ message: 'Ошибка при сохранении поездки' });
    }

    const selectSql = `SELECT * FROM trip WHERE Trip_id = ?`;
    db.query(selectSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error('❌ Ошибка при получении новой поездки:', err2);
        return res.status(500).json({ message: 'Ошибка при получении данных' });
      }

      res.json(rows[0]);
    });
  });
});

// Получение всех поездок пользователя
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT * FROM trip
    WHERE User_id = ?
    ORDER BY Trip_id DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении списка поездок:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

// Удаление поездки
router.delete('/:id', (req, res) => {
  const tripId = req.params.id;

  db.query('DELETE FROM trip WHERE Trip_id = ?', [tripId], (err, result) => {
    if (err) {
      console.error('❌ Ошибка при удалении поездки:', err);
      return res.status(500).json({ message: 'Ошибка при удалении' });
    }

    res.json({ message: 'Поездка удалена' });
  });
});

// Обновление поездки
router.put('/:id', (req, res) => {
  const tripId = req.params.id;
  const { Destination, Start_date, End_date, Cost, Guide_required } = req.body;

  const sql = `
    UPDATE trip
    SET Destination = ?, Start_date = ?, End_date = ?, Cost = ?, Guide_required = ?
    WHERE Trip_id = ?
  `;

  const values = [Destination, Start_date, End_date, Cost, Guide_required, tripId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Ошибка при обновлении поездки:', err);
      return res.status(500).json({ message: 'Ошибка сервера при редактировании поездки' });
    }

    res.json({ message: 'Поездка успешно обновлена' });
  });
});

export default router;
