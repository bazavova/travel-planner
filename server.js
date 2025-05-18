import express from 'express';
import cors from 'cors';

import registerRoutes from './server/routes/register.js';
import tripRoutes from './server/routes/trips.js';
import authRoutes from './server/routes/auth.js';
import userRoutes from './server/routes/user.js'; 
import routeRoutes from './server/routes/routes.js';
import recommendationRoutes from './server/routes/recommendations.js';
import preferencesRoutes from './server/routes/preferences.js';
import attractionRoutes from './server/routes/attractions.js';
import hotelRoutes from './server/routes/hotels.js';
import adminRoutes from './server/routes/admin.js';

const app = express();

// Мидлвары
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/register', registerRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/login', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routes', routeRoutes); 
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/user', preferencesRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/admin', adminRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
