import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GEMINI_CONFIG,
  DRAWING_ANALYSIS_PROMPT,
  COLOR_ANALYSIS_PROMPT,
  MEMORY_ANALYSIS_PROMPT
} from '../config/constants';

let genAI: GoogleGenerativeAI | null = null;
console.log(`[Gemini Init] Checking API Key... Env: ${process.env.NODE_ENV}`);
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
  console.warn('   AI analysis features will not work until you set the API key in .env file');
} else {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export interface AnalyzeDrawingParams {
  topic: string;
  imageBuffer: Buffer;
}

export interface ColorAnalysisParams {
  colors: string[];
}

export interface MemoryAnalysisParams {
  selectedCards: string[];
}

/**
 * 그림 분석 API
 * 업로드된 이미지를 분석하여 심리 상태를 파악합니다.
 * 
 * @param params - 분석 파라미터 (topic, imageBuffer)
 * @returns 분석 결과 텍스트 (한국어)
 */
export async function analyzeDrawing(params: AnalyzeDrawingParams): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다. GEMINI_API_KEY를 .env 파일에 설정해주세요.');
  }

  const { topic, imageBuffer } = params;

  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.model,
  });

  // 영어 프롬프트 사용 (정확도 향상)
  const PROFILE_PROMPT = DRAWING_ANALYSIS_PROMPT(topic);

  try {
    const result = await model.generateContent([
      PROFILE_PROMPT,
      {
        inlineData: {
          mimeType: 'image/png',
          data: imageBuffer.toString('base64'),
        },
      },
    ]);

    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error analyzing drawing:', error);
    throw new Error(`그림 분석 중 오류가 발생했습니다: ${error.message || error}`);
  }
}

/**
 * 색상 심리 분석 API
 * 선택한 색상들을 분석하여 심리 상태를 파악합니다.
 * 
 * @param params - 분석 파라미터 (colors)
 * @returns 분석 결과 텍스트 (한국어)
 */
export async function analyzeColors(params: ColorAnalysisParams): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다. GEMINI_API_KEY를 .env 파일에 설정해주세요.');
  }

  const { colors } = params;

  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.model,
  });

  // 영어 프롬프트 사용 (정확도 향상)
  const PROFILE_PROMPT = COLOR_ANALYSIS_PROMPT(colors);

  try {
    const result = await model.generateContent(PROFILE_PROMPT);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing colors:', error);
    throw new Error('색상 분석 중 오류가 발생했습니다.');
  }
}

/**
 * 기억력 테스트 분석 API
 * 기억력 테스트 결과를 분석하여 인지 능력을 평가합니다.
 * 
 * @param params - 분석 파라미터 (selectedCards)
 * @returns 분석 결과 텍스트 (한국어)
 */
export async function analyzeMemory(params: MemoryAnalysisParams): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API가 초기화되지 않았습니다. GEMINI_API_KEY를 .env 파일에 설정해주세요.');
  }

  const { selectedCards } = params;

  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.model,
  });

  // 영어 프롬프트 사용 (정확도 향상)
  const PROFILE_PROMPT = MEMORY_ANALYSIS_PROMPT(selectedCards);

  try {
    const result = await model.generateContent(PROFILE_PROMPT);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing memory:', error);
    throw new Error('기억력 분석 중 오류가 발생했습니다.');
  }
}
