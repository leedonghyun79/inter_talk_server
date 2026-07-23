/**
 * 애플리케이션 전역 상수 정의
 */

/** Gemini AI 모델 설정 */
export const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxOutputTokens: 600,
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
      
      [질문]: ${question}
      [답변]: ${answer}

      ※ 주의: 만약 주어진 질문이나 답변이 면접이나 직무 역량 평가와 전혀 관련이 없는 내용(예: 단순 장난, 일상 잡담, 부적절한 언행 등)이라면,
      절대 분석하지 말고 아래와 같이 응답하세요:
      - score: 0
      - good_points: ["면접과 관련 없는 내용입니다."] 
      - improve_points: ["면접과 관련된 질문을 입력해주세요."]
      - example_answer: "이 서비스는 면접 연습을 위한 AI입니다."

      반드시 아래 JSON 형식으로만 응답해주세요. 
      JSON 외에 어떠한 설명이나 마크다운 코드블럭(\`\`\`)도 포함하지 마십시오. 순수한 JSON 문자열만 반환하세요.

      {
        "score": (0~100 사이 정수),
        "good_points": ["강점1", "강점2"],
        "improve_points": ["보완점1", "보완점2"],
        "example_answer": "이렇게 답변해보세요: (질문에 대한 이상적인 모범 답안 1~2문장)"
      }
    `;
