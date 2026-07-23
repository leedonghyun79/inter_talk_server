/**
 * 애플리케이션 전역 상수 정의
 */

/** Gemini AI 모델 설정 */
export const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxOutputTokens: 2048,
};

/** 허용할 Origin 목록 */
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  '*', // 실무에서는 특정 도메인으로 제한하는 것이 좋으나, 개발 편의성을 위해 일단 전체 허용
];

// ============================================
// AI Analysis Prompts
// ============================================

/**
 * Interview Analysis Prompt
 */
export const INTERVIEW_ANALYSIS_PROMPT = (question: string, answer: string) => `
      당신은 다양한 직무와 산업을 아우르는 포괄적인 면접 컨설팅 전문가입니다. 아래 면접 질문에 대한 지원자의 답변을 면밀히 분석하여 합격을 위한 구체적인 피드백을 제공해주세요.
      지원자가 어떤 엉뚱한 답변을 하더라도 절대 거절하지 말고, 주어진 답변 내에서 최선을 다해 분석하고 개선점을 찾아주세요.
      
      [질문]: ${question}
      [답변]: ${answer}

      반드시 아래 JSON 형식으로만 응답해주세요. 
      JSON 외에 어떠한 설명이나 마크다운 코드블럭(\`\`\`)도 포함하지 마십시오. 순수한 JSON 문자열만 반환하세요.

      {
        "score": (0~100 사이 정수, 지원자의 답변을 평가),
        "good_points": ["답변의 긍정적인 부분이나 태도에 대한 칭찬", "좋았던 점2"],
        "improve_points": ["보완해야 할 점1", "답변이 너무 짧거나 관련 없다면 구체적으로 어떤 내용을 추가해야 하는지 조언"],
        "example_answer": "이 질문에는 이렇게 답변하는 것이 좋습니다: (모범 답안 예시)"
      }
    `;
