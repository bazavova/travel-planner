import express from 'express';
import db from '../../db.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM admin WHERE Email = ? AND Password = ? LIMIT 1';
  db.query(sql, [email, password], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при входе администратора:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    res.json(rows[0]);
  });
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  const sql = 'SELECT * FROM user ORDER BY Created_at DESC';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка при получении пользователей:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }

    res.json(rows);
  });
});

export default router;
