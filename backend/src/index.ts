import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool, initDb } from './db';
import authRouter from './routes/auth';
import summarizeRouter from './routes/summarize';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/summarize', summarizeRouter);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hola!' });
});

app.get('/api/db-check', async (_req, res) => {
  const result = await pool.query('SELECT NOW() AS now');
  res.json({ connected: true, serverTime: result.rows[0].now });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
