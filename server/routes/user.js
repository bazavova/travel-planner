import express from 'express';
import db from '../../db.js';

const router = express.Router();

// Обновление пользователя по ID
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { First_name, Last_name, Email, City } = req.body;

  const sql = `
    UPDATE User
    SET First_name = ?, Last_name = ?, Email = ?, City = ?
    WHERE User_id = ?
  `;
  const values = [First_name, Last_name, Email, City, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Ошибка при обновлении профиля:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    // Возвращаем обновлённые данные
    const selectSql = `SELECT * FROM User WHERE User_id = ?`;
    db.query(selectSql, [userId], (err, rows) => {
      if (err) {
        console.error('❌ Ошибка при получении обновлённого пользователя:', err);
        return res.status(500).json({ message: 'Ошибка получения данных' });
      }
      res.json(rows[0]);
    });
  });
});

export default router;
