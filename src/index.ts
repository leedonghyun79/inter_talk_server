import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import aiRouter from './routes/ai';
import authRouter from './routes/auth';
import { HttpError } from './utils/HttpError';

const app: Express = express();
import serverless from 'serverless-http';
const PORT = process.env.PORT || 3002;

// ============================================
// Middleware
// ============================================

// CORS 설정
app.use(
  cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

// JSON 파싱
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 요청 로깅 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

/**
 * GET /health
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI 분석 API 라우터
app.use('/api/ai', aiRouter);

// 인증 API 라우터
app.use('/api/auth', authRouter);

// ============================================
// Error Handling
// ============================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });

  if (res.headersSent) {
    return next(err);
  }

  const status = err instanceof HttpError ? err.status : 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
  });
});

/**
 * 404 핸들러
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
});

// ============================================
// Server Start (로컬 개발용)
// ============================================

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Inter Talk Server is running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

// Netlify Functions Handler
export const handler = serverless(app);
export default app;
