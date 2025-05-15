import express from 'express';
import db from '../../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { firstName, lastName, email, password, city } = req.body; // добавили city
  const isVerified = 0;
  const createdAt = new Date();

  const sql = `
    INSERT INTO User (First_name, Last_name, Email, Password_hash, Is_verified, Created_at, City)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [firstName, lastName, email, password, isVerified, createdAt, city]; // используем city из запроса

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Ошибка при регистрации:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    } else {
      res.status(201).json({ message: 'Пользователь зарегистрирован' });
    }
  });
});

export default router;
