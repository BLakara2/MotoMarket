import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middlewares/error.middleware';
import { apiRouter } from './routes';

const app = express();

// ═══════════════════════════════════════════════
// MIDDLEWARES
// ═══════════════════════════════════════════════
// CORS_ORIGIN peut être une liste d'origines séparées par des virgules
// (ex: https://a.vercel.app,http://localhost:5173) ou '*' pour tout autoriser.
const allowedOrigins = config.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (config.corsOrigin === '*' || !origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ═══════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

// ═══════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════
app.use(errorHandler);

// ═══════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════
app.listen(config.port, () => {
  console.log(`[MotoMarket API] Running on http://localhost:${config.port}`);
  console.log(`[MotoMarket API] Environment: ${config.nodeEnv}`);
});

export default app;
