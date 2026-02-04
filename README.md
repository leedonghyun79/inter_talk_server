# Silhouette Master Backend

**TypeScript + Express + Busboy + Gemini AI** 기반의 백엔드 API 서버입니다.  
Google Cloud Functions에 배포 가능한 서버리스 아키텍처로 구성되어 있습니다.

## 🎯 주요 기능

- 🎨 **그림 심리 분석** - 업로드된 그림을 분석하여 심리 상태 파악
- 🌈 **색상 심리 분석** - 선택한 색상을 통한 심리 분석
- 🧠 **기억력 테스트 분석** - 기억력 테스트 결과 분석
- 📤 **파일 업로드** - Busboy를 사용한 효율적인 multipart/form-data 처리
- ☁️ **서버리스** - Google Cloud Functions 배포 지원

## 🏗️ 기술 스택

- **Runtime**: Node.js 20
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.7.3
- **AI**: Google Gemini AI (gemini-1.5-flash)
- **File Upload**: Busboy 1.6.0
- **Deployment**: Google Cloud Functions

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── index.ts                  # 메인 서버 파일 (GCF 엔트리포인트)
│   ├── config/
│   │   └── constants.ts          # 전역 상수 정의
│   ├── routes/
│   │   └── ai.ts                 # AI 분석 API 라우터
│   ├── services/
│   │   └── geminiService.ts      # Gemini AI 서비스
│   └── utils/
│       ├── HttpError.ts          # 커스텀 에러 클래스
│       └── fileUpload.ts         # Busboy 파일 업로드 유틸
├── dist/                         # 빌드 결과물
├── .env                          # 환경 변수
├── .gcloudignore                 # GCF 배포 제외 파일
├── package.json
├── tsconfig.json
├── DEPLOYMENT.md                 # 배포 가이드
└── README.md
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

## 📡 API 엔드포인트

### Health Check

```http
GET /health
```

**응답:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

---

### 그림 분석

```http
POST /api/ai/analyze-drawing
Content-Type: multipart/form-data
```

**요청 (Form Data):**
- `image`: 이미지 파일 (JPEG, PNG, WEBP, 최대 10MB)
- `topic`: 그림 주제 (예: "나무", "집", "사람")

**응답:**
```json
{
  "success": true,
  "analysis": "그림 분석 결과...",
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

---

### 색상 분석

```http
POST /api/ai/analyze-colors
Content-Type: application/json
```

**요청:**
```json
{
  "colors": ["#FF0000", "#00FF00", "#0000FF"]
}
```

**응답:**
```json
{
  "success": true,
  "analysis": "색상 분석 결과...",
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

---

### 기억력 분석

```http
POST /api/ai/analyze-memory
Content-Type: application/json
```

**요청:**
```json
{
  "selectedCards": ["card1", "card2", "card3"]
}
```

**응답:**
```json
{
  "success": true,
  "analysis": "기억력 분석 결과...",
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

## 🛠️ 개발 스크립트

```bash
# 개발 서버 (Hot Reload)
npm run dev

# TypeScript 빌드
npm run build

# 프로덕션 서버
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint

# Google Cloud Functions 배포
npm run deploy
```

## ☁️ Google Cloud Functions 배포

상세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

### 빠른 배포

```bash
# 1. Google Cloud SDK 설치 및 로그인
gcloud init

# 2. 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID

# 3. 배포
npm run deploy
```

배포 후 다음 URL로 접근:
```
https://REGION-PROJECT_ID.cloudfunctions.net/silhouette-api
```

## 🔧 환경 변수

| 변수 | 설명 | 필수 | 기본값 |
|------|------|------|--------|
| `GEMINI_API_KEY` | Google Gemini API 키 | ✅ | - |
| `PORT` | 서버 포트 (로컬 개발용) | ❌ | 3001 |
| `NODE_ENV` | 실행 환경 | ❌ | development |

## 📝 사용 예시

### cURL

```bash
# 색상 분석
curl -X POST http://localhost:3001/api/ai/analyze-colors \
  -H "Content-Type: application/json" \
  -d '{"colors": ["#FF0000", "#00FF00"]}'

# 그림 분석
curl -X POST http://localhost:3001/api/ai/analyze-drawing \
  -F "image=@/path/to/image.jpg" \
  -F "topic=나무"
```

### JavaScript (Fetch API)

```javascript
// 색상 분석
const response = await fetch('http://localhost:3001/api/ai/analyze-colors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ colors: ['#FF0000', '#00FF00'] })
});
const data = await response.json();

// 그림 분석 (multipart/form-data)
const formData = new FormData();
formData.append('image', imageFile);
formData.append('topic', '나무');

const response = await fetch('http://localhost:3001/api/ai/analyze-drawing', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

## 🔐 보안

- ✅ CORS 설정으로 허용된 Origin만 접근 가능
- ✅ 파일 크기 제한 (10MB)
- ✅ 파일 타입 검증 (JPEG, PNG, WEBP만 허용)
- ✅ 환경 변수를 통한 API 키 관리
- ✅ HttpError를 통한 명확한 에러 처리

## 📚 추가 문서

- [배포 가이드](./DEPLOYMENT.md) - Google Cloud Functions 배포 방법
- [GUIDE.md](./GUIDE.md) - 상세 사용 가이드
- [예시 코드](./examples/) - 프론트엔드 연동 예시

## 🤝 기여

이슈나 개선 사항이 있다면 자유롭게 제안해주세요!

## 📄 라이선스

ISC
