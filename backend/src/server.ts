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
app.use(cors({
  origin: config.corsOrigin,
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
