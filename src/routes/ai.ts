import { Router, Request, Response } from 'express';
import { analyzeDrawing, analyzeColors, analyzeMemory } from '../services/geminiService';
import { receiveImage } from '../utils/fileUpload';
import { HttpError } from '../utils/HttpError';

const router = Router();

/**
 * POST /api/ai/analyze-drawing
 * 그림 심리 분석 (multipart/form-data)
 * 
 * 요청:
 * - Content-Type: multipart/form-data
 * - Body: 
 *   - image: 이미지 파일 (JPEG, PNG, WEBP)
 *   - topic: 그림 주제 (예: "나무", "집", "사람")
 */
router.post('/analyze-drawing', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Content-Type 검증
    const contentType = req.headers['content-type'] || '';

    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Content-Type은 multipart/form-data여야 합니다.',
      });
      return;
    }

    // 2. 이미지 파일 추출
    const imageBuffer = await receiveImage(req);

    if (!imageBuffer) {
      res.status(400).json({
        error: 'Bad Request',
        message: '이미지 파일이 제공되지 않았습니다.',
      });
      return;
    }

    // 3. topic 파라미터 추출 (폼 필드에서)
    const topic = (req.body && req.body.topic) || '그림';

    // 4. AI 분석
    const analysis = await analyzeDrawing({ topic, imageBuffer });

    // 5. 성공 응답
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in analyze-drawing:', error);

    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';

    res.status(status).json({
      error: 'Internal Server Error',
      message,
    });
  }
});

/**
 * POST /api/ai/analyze-colors
 * 색상 심리 분석 (JSON)
 * 
 * 요청:
 * - Content-Type: application/json
 * - Body: { colors: ["#FF0000", "#00FF00"] }
 */
router.post('/analyze-colors', async (req: Request, res: Response): Promise<void> => {
  try {
    const { colors } = req.body;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'colors 배열은 필수 항목입니다.',
      });
      return;
    }

    const analysis = await analyzeColors({ colors });

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in analyze-colors:', error);

    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';

    res.status(status).json({
      error: 'Internal Server Error',
      message,
    });
  }
});

/**
 * POST /api/ai/analyze-memory
 * 기억력 테스트 분석 (JSON)
 * 
 * 요청:
 * - Content-Type: application/json
 * - Body: { selectedCards: ["card1", "card2"] }
 */
router.post('/analyze-memory', async (req: Request, res: Response): Promise<void> => {
  try {
    const { selectedCards } = req.body;

    if (!selectedCards || !Array.isArray(selectedCards)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'selectedCards 배열은 필수 항목입니다.',
      });
      return;
    }

    const analysis = await analyzeMemory({ selectedCards });

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in analyze-memory:', error);

    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';

    res.status(status).json({
      error: 'Internal Server Error',
      message,
    });
  }
});

export default router;
