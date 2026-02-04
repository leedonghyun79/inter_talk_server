import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import aiRouter from './routes/ai';
import { ALLOWED_ORIGINS } from './config/constants';
import { HttpError } from './utils/HttpError';

const app: Express = express();
import serverless from 'serverless-http';
const PORT = process.env.PORT || 3001;

// ============================================
// Middleware
// ============================================

// CORS 설정
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

// JSON 파싱 (색상/기억력 분석용)
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
 * 서버 상태 확인용 헬스 체크 엔드포인트
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI 분석 API 라우터
app.use('/api/ai', aiRouter);

// ============================================
// Error Handling
// ============================================

/**
 * 전역 에러 핸들러
 * 라우트에서 처리되지 않은 에러를 처리합니다.
 */
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
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

// ============================================
// Export for Google Cloud Functions
// ============================================

/**
 * Google Cloud Functions HTTP 엔트리포인트
 * 
 * 배포 명령어:
 * gcloud functions deploy silhouette-api \
 *   --runtime nodejs20 \
 *   --trigger-http \
 *   --allow-unauthenticated \
 *   --entry-point=api \
 *   --set-env-vars GEMINI_API_KEY=your_key_here
 */
export const api = app;

// 로컬 개발 또는 다른 환경용
export default app;

// Netlify Functions Handler
export const handler = serverless(app);
