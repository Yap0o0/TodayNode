# 📝 하루 노드 (Haru Node)

**Gemini AI와 Spotify API를 활용한 감정 기록 및 음악 추천 웹 애플리케이션**

"하루 노드"는 바쁜 현대인이 짧은 시간 안에 자신의 하루를 기록하고, AI 분석을 통해 맞춤형 음악과 인사이트를 제공받을 수 있는 웹 서비스입니다.

## 🚀 주요 기능

### 1. 감정 기록 (Mood Logging)
- 5가지 감정(행복, 신남, 편안, 그저, 우울) 중 하나를 선택하여 간편하게 기록합니다.
- 태그와 간단한 메모를 추가하여 하루의 맥락을 남길 수 있습니다.

### 2. 맞춤형 음악 추천 (Music Recommendation)
- 선택한 기분과 태그를 바탕으로 **Spotify API**를 통해 어울리는 음악 5곡을 추천해 줍니다.
- 예: "행복" + "#운동" -> 신나는 팝/댄스 음악 추천

### 3. AI 감정 분석 (AI Insights)
- **Google Gemini AI**가 누적된 기록을 분석하여 나만의 감정 패턴을 알려줍니다.
- 태그와 감정의 상관관계, 기분에 따른 음악 취향 등을 분석합니다.

### 4. 캘린더 및 통계 (Calendar & Stats)
- 캘린더 뷰에서 한 달 동안의 감정 흐름을 색상으로 한눈에 파악할 수 있습니다.
- 차트를 통해 감정 분포를 시각적으로 확인할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Data**: Spotify Web API
- **Storage**: LocalStorage (Server-less)
- **Visualization**: Chart.js

---

## 📦 설치 및 실행 방법 (Getting Started)

### 1. 프로젝트 클론
\`\`\`bash
git clone <repository-url>
cd haru-node
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정 (.env)
프로젝트 루트에 \`.env\` 파일을 생성하고 다음 내용을 입력하세요.
(API 키 발급 방법은 \`.env.example\` 파일을 참고하세요)

\`\`\`env
# Spotify API Keys
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key
\`\`\`

### 4. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

---

## 🔒 보안 및 프라이버시
- 본 프로젝트는 별도의 백엔드 서버 없이 **브라우저의 LocalStorage**에 모든 데이터를 저장합니다.
- 개인적인 일기 데이터는 외부 서버로 전송되지 않으므로 안심하고 사용할 수 있습니다.
- **주의**: API 키는 \`.env\` 파일에만 저장하며, Git에 커밋되지 않도록 주의해 주세요.

---

## 🧑‍💻 개발자
- **이름**: 정희영
- **학과**: 인공지능학과 20223520
