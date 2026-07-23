import { Router, Request, Response } from 'express';
import { analyzeInterview, transcribeAudio } from '../services/geminiService';

const router = Router();

/**
 * POST /api/ai/analyze-interview
 * 면접 답변 분석
 */
router.post('/analyze-interview', async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      res.status(400).json({
        success: false,
        message: '질문과 답변을 모두 입력해주세요.'
      });
      return;
    }

    const analysis = await analyzeInterview({ question, answer });

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in analyze-interview:', error);
    res.status(500).json({
      success: false,
      message: error.message || '분석 중 오류가 발생했습니다.'
    });
  }
});

/**
 * POST /api/ai/transcribe
 * 음성 → 텍스트 변환 (Gemini 멀티모달)
 * body: { audio: string (base64), mimeType: string }
 */
router.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio, mimeType } = req.body;

    if (!audio || !mimeType) {
      res.status(400).json({
        success: false,
        message: '오디오 데이터와 mimeType을 입력해주세요.'
      });
      return;
    }

    const transcript = await transcribeAudio(audio, mimeType);

    res.json({
      success: true,
      transcript,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in transcribe:', error);
    res.status(500).json({
      success: false,
      message: error.message || '음성 변환 중 오류가 발생했습니다.'
    });
  }
});

export default router;
