// import-real-routes.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

try {
  console.log('🧹 Удаляем старые маршруты...');
  await connection.execute('DELETE FROM Route');

  const [cities] = await connection.execute(
    'SELECT DISTINCT City FROM Attraction WHERE City IS NOT NULL'
  );

  for (const row of cities) {
    const city = row.City;
    const [attractions] = await connection.execute(
      'SELECT Name FROM Attraction WHERE City = ? ORDER BY RAND() LIMIT 5',
      [city]
    );

    if (attractions.length < 3) {
      console.log(`⏭ Пропускаем ${city} — слишком мало достопримечательностей.`);
      continue;
    }

    const names = attractions.map(a => a.Name).join(', ');
    const description = `Маршрут включает: ${names}`;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30 + 10));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 4 + 2));

    const cost = Math.floor(Math.random() * 20000 + 15000);
    const types = ['culture', 'nature', 'city', 'shopping'];
    const languages = ['ru', 'en'];

    await connection.execute(
      `INSERT INTO Route 
      (Destination, Description, Start_date, End_date, Cost, Travel_type, Language, Guide_required)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        city,
        description,
        startDate.toISOString().slice(0, 10),
        endDate.toISOString().slice(0, 10),
        cost,
        types[Math.floor(Math.random() * types.length)],
        languages[Math.floor(Math.random() * languages.length)],
        Math.random() > 0.5 ? 1 : 0
      ]
    );

    console.log(`✅ Маршрут создан: ${city}`);
  }

  await connection.end();
  console.log('🎉 Все маршруты успешно добавлены!');

} catch (err) {
  console.error('❌ Ошибка при генерации маршрутов:', err);
  await connection.end();
  process.exit(1);
}
