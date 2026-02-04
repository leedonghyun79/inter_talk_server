/**
 * 애플리케이션 전역 상수 정의
 */

/** 업로드 가능한 최대 파일 크기 (10MB) */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** 허용되는 이미지 MIME 타입 */
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/** Busboy 파일 파싱 제한 */
export const BUSBOY_LIMITS = {
  fileSize: MAX_FILE_SIZE_BYTES,
  files: 1,
  fields: 20,
  parts: 25,
};

/** Gemini AI 모델 설정 */
export const GEMINI_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxOutputTokens: 2048,
};

/** 허용할 Origin 목록 */
export const ALLOWED_ORIGINS = [
  'https://artpsy.apps.tossmini.com',
  'https://artpsy.private-apps.tossmini.com',// apps-in-toss Console QR test
  'http://192.168.0.201:5173', // Restore Mobile/LAN dev origin
  'http://localhost:5173',
  'http://localhost:3000',
];

// ============================================
// AI Analysis Prompts (English for accuracy)
// ============================================

/**
 * Drawing Analysis Prompt
 * Analyzes user's drawing to understand their psychological state
 */
export const DRAWING_ANALYSIS_PROMPT = (topic: string) => `
      당신은 냉철하고 통찰력 있는 그림 심리 상담 전문가입니다. 
      사용자가 '${topic}'(이)라는 주제로 그린 그림을 보고 심리를 분석해주세요.
      
      단순히 좋게 포장하지 말고, 그림의 선(필압, 끊김), 위치(치우침), 크기, 생략된 부분 등을 날카롭게 분석하여
      내면의 불안, 스트레스, 숨겨진 결핍이나 방어기제까지 포함한 현실적이고 균형 잡힌 분석을 제공해주세요.
      너무 긍정적인 말만 나열하지 말고, 사용자가 "진짜 내 마음을 꿰뚫어봤다"고 느낄 수 있도록 구체적인 심리적 근거를 들어 설명해주세요.

      반드시 아래 JSON 형식으로만 응답해주세요. 
      모든 값은 반드시 '한국어(Korean)'로 작성해야 합니다. 영어로 작성하지 마십시오.
      JSON 외에 어떠한 설명이나 마크다운 코드블럭(\`\`\`)도 포함하지 마십시오. 순수한 JSON 문자열만 반환하세요.

      {
        "topic": "${topic}",
        "personality": "핵심을 찌르는 성격 요약 (예: 겉은 밝지만 속은 곪아있는 '외강내유형')",
        "keywords": ["#키워드1", "#키워드2", "#키워드3"],
        "description": "상세 분석 (3-4문장): 그림의 구체적 특징(선, 위치 등)을 근거로 내면의 상태를 설명하세요. 긍정적인 부분과 현재 겪고 있을 심리적 어려움을 5:5 비율로 섞어서 서술하세요.",
        "relationships": "대인관계 및 연애 (2-3문장): 관계에서의 패턴, 두려움, 또는 집착하는 부분을 분석하세요.",
        "workStyle": "업무 스타일 (2-3문장): 업무에서의 강점뿐만 아니라, 스트레스를 받는 상황이나 단점도 함께 언급하세요.",
        "advice": "뼈 때리는 현실적인 조언 한마디",
        "shareText": "공유용 짧은 텍스트 (예: 나도 몰랐던 내 속마음은? 겉은 밝지만 속은... 🤫 #소름돋는심리테스트)"
      }
    `;

/**
 * Color Psychology Analysis Prompt
 * Analyzes selected colors to understand psychological preferences
 */
export const COLOR_ANALYSIS_PROMPT = (colors: string[]) => `You are an expert in color psychology and emotional analysis.

Analyze the following colors selected by the user: ${colors.join(', ')}

For each color, explain:
- **Psychological Meaning**: What this color typically represents in psychology
- **Emotional Associations**: Common feelings and moods associated with this color
- **Personality Traits**: What preference for this color might indicate

Then provide an overall analysis:
- **Combined Interpretation**: What the combination of these colors reveals
- **Current Emotional State**: Likely mood or mindset
- **Personality Insights**: Character traits suggested by these choices
- **Recommendations**: Gentle suggestions based on the color profile

Important:
- Be positive and constructive
- Acknowledge that color preferences can vary by culture and individual
- Avoid stereotyping or rigid interpretations
- Focus on self-discovery and awareness

Respond in Korean language with warm, relatable explanations that help the user understand themselves better.`;

/**
 * Memory Test Analysis Prompt
 * Analyzes memory test results to assess cognitive abilities
 */
export const MEMORY_ANALYSIS_PROMPT = (selectedCards: string[]) => `You are a cognitive psychologist specializing in memory and attention assessment.

Analyze the user's memory test results based on the following selected cards: ${selectedCards.join(', ')}

Evaluate and provide insights on:
- **Memory Performance**: Assessment of recall accuracy and pattern recognition
- **Cognitive Strengths**: Areas where the user demonstrated strong performance
- **Attention Patterns**: Focus, concentration, and attention to detail
- **Processing Style**: How the user approaches and retains information

Provide constructive feedback including:
1. **Performance Level**: Honest but encouraging assessment
2. **Cognitive Abilities**: Specific strengths identified
3. **Improvement Strategies**: Practical tips to enhance memory and focus
4. **Lifestyle Recommendations**: Habits that support cognitive health (sleep, exercise, nutrition, mental stimulation)

Important:
- Be encouraging and supportive
- Emphasize that memory can be improved with practice
- Avoid making the user feel inadequate
- Focus on actionable advice and growth mindset

Respond in Korean language with clear, practical advice that motivates the user to develop their cognitive abilities.`;
