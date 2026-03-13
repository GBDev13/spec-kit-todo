import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }));

app.use('/todos', todosRouter);

export default app;
