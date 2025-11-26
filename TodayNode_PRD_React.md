# **📝 하루 노드 (Haru Node) \- 제품 요구사항 정의서 (PRD)**

**Project**: 제미나이(Gemini)를 이용한 웹 프로그램 개발

**Author**: 인공지능학과 20223520 정희영

**Duration**: 2025.11.13 \~ 2025.12.07 (약 1개월)

**Role**: Frontend Developer & AI Prompt Engineer

## **1\. 프로젝트 개요 (Overview)**

### **1.1. 배경 및 필요성**

* **현황**: 현대 사회의 높은 스트레스와 번아웃으로 인해 '소확행(소소하지만 확실한 행복)'의 가치가 대두됨.  
* **문제점**: 기존 일기 앱은 긴 글 작성에 대한 심리적 장벽(숙제 같은 부담)이 높아 꾸준한 기록이 어려움.  
* **해결책**:  
  * **Micro-logging**: 10초 이내에 감정과 태그만으로 하루를 기록.  
  * **Immediate Reward**: 기록 즉시 AI가 분석하여 맞춤형 음악을 추천하고 피드백 제공.  
  * **Digital Wellness**: 데이터 기반으로 자신의 감정 패턴을 이해하고 긍정적 습관 형성 유도.

### **1.2. 프로젝트 목표**

* **공학적 목표**:  
  * **Vite \+ React** 기반의 모던 웹 애플리케이션 구축.  
  * **Google Gemini AI**를 연동하여 감정 분석 및 맥락 태그 추출 모듈 구현.  
  * **Spotify API**를 연동하여 태그 기반 맞춤형 음악 추천 기능 구현.  
  * **LocalStorage**를 활용한 Server-less 데이터 프라이버시 확보.  
* **비공학적 목표**:  
  * 일기 작성의 심리적 장벽을 낮추고 기록의 즐거움 제공.  
  * 데이터 시각화를 통한 자기 이해(Self-Insight) 돕기.

## **2\. 기술 스택 (Tech Stack)**

| 구분 | 기술 | 비고 |
| :---- | :---- | :---- |
| **Frontend** | React, Vite | 빠른 빌드 및 컴포넌트 기반 개발 |
| **Styling** | CSS / Tailwind CSS | (권장) 반응형 디자인 및 테마 커스터마이징 |
| **AI Engine** | Google Gemini API | 감정 분석, 태그 추출, 상관관계 분석 |
| **Data API** | Spotify Web API | 감정/태그 기반 음악 검색 및 추천 |
| **Storage** | LocalStorage | 브라우저 내 데이터 영구 저장 (No Backend) |
| **Visualization** | Chart.js (or Recharts) | 감정 통계 및 상관관계 시각화 |
| **Tool** | VS Code, Figma | 개발 및 디자인 |

## **3\. 기능 명세 (Functional Specifications)**

### **🚀 P0: 필수 기능 (MVP) \- 11월 3주차 목표**

**핵심 가치**: 사용자가 별다른 노력 없이도 기록을 남길 수 있어야 함.

* \[ \] **감정 기록 (Mood Logging)**  
  * 앱 접속 시 "오늘의 기분" 선택 UI 제공 (5단계: 행복, 신남, 편안, 그저, 우울).  
  * 클릭 시 즉각적인 시각적 피드백 제공.  
* \[ \] **시간 자동 기록**  
  * 기분 선택 시점의 날짜와 시간(YYYY-MM-DD HH:mm) 자동 저장.  
* \[ \] **맥락 기록 (Tagging)**  
  * **추천 태그**: \#운동, \#음식, \#휴식 등 기본 태그 버튼 제공.  
  * **사용자 태그**: 사용자가 직접 텍스트 입력 후 추가 가능.  
  * (선택) 원한다면 짧은 줄글 일기 작성 영역 제공.  
* \[ \] **테마 설정 (UI Customization)**  
  * 캘린더 뷰에서 기분에 따라 해당 날짜의 테두리/배경색 변경.  
  * 사용자가 자신의 기분에 맞는 테마/아이콘 커스터마이징 지원.  
* \[ \] **데이터 저장**  
  * 모든 데이터는 LocalStorage에 JSON 포맷으로 저장.

### **⭐ P1: 주요 기능 (Main) \- 11월 4주차 목표**

**핵심 가치**: 기록에 대한 보상(음악)과 분석(인사이트) 제공.

* \[ \] **감정 기반 음악 추천**  
  * Logic: User Mood \+ Selected Tags \-\> **Gemini** (키워드 추출) \-\> **Spotify API** (검색).  
  * 추천된 음악 리스트(5개) 표시 및 미리듣기/링크 제공.  
  * 피드백: 추천 음악이 마음에 들지 않을 경우 "제외" 기능 (향후 추천 로직 반영).  
* \[ \] **감정 차트 시각화**  
  * 월간/전체 단위 감정 분포 통계 (예: 도넛 차트, 캘린더 히트맵).  
* \[ \] **태그-감정 상관관계 분석 (Gemini)**  
  * **Insight**: *"\#행복 감정은 \#게임 태그와 함께 총 N번 나타났습니다."*  
  * **Music Stat**: *"\#신남 감정일 때 \#힙합 장르를 가장 많이 들었습니다."*

### **🔮 P2: 향후 기능 (Future) \- 12월 1주차 이후**

* \[ \] **소셜 공유**: "오늘의 기분" 카드 이미지 생성 및 공유, 이모지 반응/댓글.  
* \[ \] **리워드 (Gamification)**: 꾸준한 기록 시 "성취 뱃지" 부여.  
* \[ \] **알림 (Notification)**: 하루가 끝나기 2시간 전 기록 유도 알림.  
* \[ \] **백업**: 데이터 내보내기/가져오기 기능.

## **4\. AI 협업 전략 (R\&R)**

본 프로젝트는 **Human-AI Collaboration**을 통해 개발 효율성을 극대화합니다.

### **🧑‍💻 개발자 (Human: 정희영)**

1. **UI/UX 구축**: React 컴포넌트 구조 설계, CSS 스타일링, 인터랙션 구현.  
2. **Prompt Engineering**: Gemini가 최적의 분석 결과를 내도록 프롬프트 작성 및 튜닝.  
3. **Code Audit**: AI가 생성한 코드의 정합성 검토, 디버깅, 최종 통합.

### **🤖 AI (Gemini CLI / Assistant)**

1. **Logic Generation**:  
   * LocalStorage CRUD(생성/조회/수정/삭제) 로직 구현.  
   * Spotify API 연동을 위한 비동기 통신 함수 작성.  
   * 복잡한 데이터 필터링 및 차트 데이터 가공 로직 생성.  
2. **Data Analysis**:  
   * 사용자 로그 데이터를 바탕으로 태그-감정 상관관계 분석 텍스트 생성.

## **5\. 데이터 구조 예시 (Schema)**

LocalStorage에 저장될 데이터(haru-node-logs)의 구조 예시입니다.

\[  
  {  
    "id": "uuid-v4",  
    "date": "2025-11-19",  
    "timestamp": "2025-11-19T14:30:00",  
    "mood": "happy", // enum: happy, excited, calm, soso, sad  
    "tags": \["\#커피", "\#친구", "\#수다"\],  
    "content": "오랜만에 친구랑 카페에서 수다 떨어서 좋았다.",  
    "musicRecommendation": {  
      "genre": "acoustic",  
      "track": "IU \- Blueming",  
      "liked": true  
    }  
  }  
\]

## **6\. 개발 일정 (Timeline)**

* **\~ 11.19**: Figma 디자인 구체화, 프로젝트 초기 세팅 (Vite).  
* **11.20 \~ 11.24**: P0 필수 기능 구현 (감정/태그 입력, LocalStorage 연동).  
* **11.25 \~ 11.30**: P1 주요 기능 구현 (Spotify API 연동, Gemini 분석 모듈).  
* **12.01 \~ 12.07**: UI/UX 폴리싱, 버그 수정, 최종 테스트 및 문서화.

\#\#\# 💡 VS Code 설정 팁 (개발 시작 전)

1\.  \*\*프로젝트 생성\*\*:  
    \`\`\`bash  
    npm create vite@latest haru-node \-- \--template react  
    cd haru-node  
    npm install  
    \`\`\`  
2\.  \*\*필요한 라이브러리 설치\*\* (터미널에 입력):  
    \`\`\`bash  
    \# 아이콘 사용  
    npm install lucide-react  
    \# 라우팅 (필요 시)  
    npm install react-router-dom  
    \# 차트 라이브러리 (P1 단계)  
    npm install recharts  
    \# 스타일링 (Tailwind CSS 추천)  
    npm install \-D tailwindcss postcss autoprefixer  
    npx tailwindcss init \-p  

##Rules
1. **MVVM 엄수**
2. **한글 주석** : 학생용 교육 코드
3. **KISS** : 불필요한 복잡성 회피 및 직관적인 디자인
4. **DRY** : 전체 프로젝트에서 반복되는 동일 코드가 없도록 주의