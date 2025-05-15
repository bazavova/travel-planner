import express from 'express';
import db from '../../db.js'; // модуль подключения к MySQL
const router = express.Router();

// РЕГИСТРАЦИЯ
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, city } = req.body;

  const query = `
    INSERT INTO User (First_name, Last_name, Email, Password_hash, Is_verified, Created_at, City)
    VALUES (?, ?, ?, ?, 0, NOW(), ?)
  `;

  db.query(
    query,
    [firstName, lastName, email, password, city],
    (err, result) => {
      if (err) {
        console.error('Ошибка при регистрации:', err);
        return res.status(500).json({ success: false, message: 'Ошибка сервера' });
      }
      res.status(200).json({ success: true, message: 'Регистрация успешна' });
    }
  );
});

// ВХОД
router.post('/', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM User WHERE Email = ? AND Password_hash = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Ошибка при входе:', err);
        return res.status(500).json({ success: false, message: 'Ошибка сервера' });
      }

      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
      }

      const user = results[0];
      res.json({ success: true, message: 'Вход выполнен', user });
    }
  );
});

export default router;
