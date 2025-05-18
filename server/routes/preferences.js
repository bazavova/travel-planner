import express from 'express';
import db from '../../db.js';

const router = express.Router();

// ✅ Получение предпочтений по userId
router.get('/:userId/preferences', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT * FROM Preferences WHERE User_id = ? LIMIT 1';
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении предпочтений:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Предпочтения не найдены' });
    }

    res.json(rows[0]);
  });
});

// ✅ Обновление предпочтений по userId
router.put('/:userId/preferences', (req, res) => {
  const userId = req.params.userId;
  const { Travel_type, Budget, Language, Other_preferences } = req.body;

  const sql = `
    UPDATE Preferences
    SET Travel_type = ?, Budget = ?, Language = ?, Other_preferences = ?
    WHERE User_id = ?
  `;

  const values = [Travel_type, Budget, Language, Other_preferences, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Ошибка при обновлении предпочтений:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    res.json({ message: 'Предпочтения обновлены' });
  });
});

export default router;
