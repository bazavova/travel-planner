import express from 'express';
import cors from 'cors';

import registerRoutes from './server/routes/register.js';
import tripRoutes from './server/routes/trips.js';
import authRoutes from './server/routes/auth.js';
import userRoutes from './server/routes/user.js'; 
import routeRoutes from './server/routes/routes.js';

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
