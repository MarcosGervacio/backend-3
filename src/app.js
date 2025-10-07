import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockingPetsRouter from './routes/mockingpets.router.js';
import { errorHandler } from './errors/errorHandler.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://marger96vm:pe3EjAWYu1pdpG0a@cluster0.jaoerii.mongodb.net/backend3?retryWrites=true&w=majority&appName=Cluster0`)

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/mockingpets', mockingPetsRouter);
app.use('/api/mocks', mocksRouter);

app.use(errorHandler);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
