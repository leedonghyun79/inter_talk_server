import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, INTERVIEW_ANALYSIS_PROMPT } from '../config/constants';

let genAI: GoogleGenerativeAI | null = null;

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
} else {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export interface AnalyzeInterviewParams {
  question: string;
  answer: string;
}

export interface InterviewAnalysisResult {
  score: number;
  good_points: string[];
  improve_points: string[];
  example_answer: string;
}

/**
 * 면접 답변 분석 API
 */
export async function analyzeInterview(params: AnalyzeInterviewParams): Promise<InterviewAnalysisResult> {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다. GEMINI_API_KEY를 .env 파일에 설정해주세요.');
  }

  const { question, answer } = params;
  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.model,
    generationConfig: {
      temperature: GEMINI_CONFIG.temperature,
      maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
    },
  });

  const prompt = INTERVIEW_ANALYSIS_PROMPT(question, answer);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // JSON 파싱 전처리
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text) as InterviewAnalysisResult;
  } catch (error: any) {
    console.error('Error analyzing interview:', error);
    throw new Error(`면접 분석 중 오류가 발생했습니다: ${error.message || error}`);
  }
}

/**
 * 음성 → 텍스트 변환 (Gemini 멀티모달)
 */
export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      },
      {
        text: '이 음성을 한국어로 그대로 받아쓰기 해주세요. 음성에서 들리는 내용만 정확하게 텍스트로 변환하고, 다른 설명이나 부연 없이 변환된 텍스트만 출력해주세요.',
      },
    ]);

    return result.response.text().trim();
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    throw new Error(`음성 변환 중 오류가 발생했습니다: ${error.message || error}`);
  }
}
