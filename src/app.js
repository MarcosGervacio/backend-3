import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockingPetsRouter from './routes/mockingpets.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './errors/errorHandler.js';

const app = express();

// --- Config ---
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.warn('[WARN] MONGO_URL no definido. Configura tu .env');
}

// Conexión Mongo
await mongoose.connect(MONGO_URL);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routers
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/mockingpets', mockingPetsRouter);
app.use('/api/mocks', mocksRouter);

// Documentación Swagger
const usersSpecUrl = new URL('./docs/openapi-users.yaml', import.meta.url);
const usersSpec = YAML.parse(fs.readFileSync(fileURLToPath(usersSpecUrl), 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(usersSpec));


app.use(errorHandler);


export default app;

// Levantar server sólo si no es test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
