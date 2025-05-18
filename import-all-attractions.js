import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const folderPath = path.resolve('.geojson');

try {
  console.log('🧹 Удаляем старые записи...');
  await db.execute('DELETE FROM Attraction');

  const files = await fs.readdir(folderPath);
  const geojsonFiles = files.filter(f => f.endsWith('.geojson'));

  for (const file of geojsonFiles) {
    const cityName = file.replace('.geojson', '').replace(/-/g, ' '); // Sankt-Peterburg → Sankt Peterburg
    const fullPath = path.join(folderPath, file);
    const raw = await fs.readFile(fullPath, 'utf-8');
    const geojson = JSON.parse(raw);

    for (const feature of geojson.features) {
      const name = feature.properties?.name;
      if (!name) continue;

      const coordinates = feature.geometry?.coordinates;
      if (!coordinates || coordinates.length < 2) continue;

      const lon = parseFloat(coordinates[0]);
      const lat = parseFloat(coordinates[1]);
      if (isNaN(lat) || isNaN(lon)) continue;

      const description = feature.properties?.description || null;

      await db.execute(
        'INSERT INTO Attraction (Name, Lat, Lon, Description, City) VALUES (?, ?, ?, ?, ?)',
        [name, lat, lon, description, cityName]
      );
    }

    console.log(`✅ Импорт завершён для города: ${cityName}`);
  }

  await db.end();
  console.log('🎉 Импорт завершён для всех файлов!');
} catch (err) {
  console.error('❌ Ошибка при импорте:', err);
}
