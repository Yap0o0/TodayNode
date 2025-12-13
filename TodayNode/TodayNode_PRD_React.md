# **📝 하루 노드 (Haru Node) - 제품 요구사항 정의서 (PRD)**

**Project**: 제미나이(Gemini)를 이용한 웹 프로그램 개발

**Author**: 인공지능학과 20223520 정희영

**Duration**: 2025.11.13 ~ 2025.12.07 (약 1개월)

**Role**: Frontend Developer & AI Prompt Engineer

## **1. 프로젝트 개요 (Overview)**

### **1.1. 배경 및 필요성**

* **현황**: 현대 사회의 높은 스트레스와 번아웃으로 인해 '소확행(소소하지만 확실한 행복)'의 가치가 대두됨.
* **문제점**: 기존 일기 앱은 긴 글 작성에 대한 심리적 장벽(숙제 같은 부담)이 높아 꾸준한 기록이 어려움.
* **해결책**:
  * **Micro-logging**: 10초 이내에 감정과 태그만으로 하루를 기록.
  * **Immediate Reward**: 기록 즉시 AI가 분석하여 맞춤형 음악을 추천하고 피드백 제공.
  * **Digital Wellness**: 데이터 기반으로 자신의 감정 패턴을 이해하고 긍정적 습관 형성 유도.

### **1.2. 프로젝트 목표**

* **공학적 목표**:
  * **Vite + React** 기반의 모던 웹 애플리케이션 구축.
  * **Google Gemini AI**를 연동하여 감정 분석 및 맥락 태그 추출 모듈 구현.
  * **Spotify API**를 연동하여 태그 기반 맞춤형 음악 추천 기능 구현.
  * **LocalStorage**를 활용한 Server-less 데이터 프라이버시 확보.
* **비공학적 목표**:
  * 일기 작성의 심리적 장벽을 낮추고 기록의 즐거움 제공.
  * 데이터 시각화를 통한 자기 이해(Self-Insight) 돕기.

### **1.3. 정의, 두문자어 및 약어 (Definitions, Acronyms, and Abbreviations)**

| 용어 | 정의 |
| :--- | :--- |
| **SPA** | Single Page Application - 단일 페이지로 구성된 웹 애플리케이션 |
| **React** | 사용자 인터페이스 구축을 위한 JavaScript 라이브러리 |
| **Vite** | 빠른 개발 서버와 최적화된 빌드를 제공하는 프론트엔드 빌드 도구 |
| **Tailwind CSS** | 유틸리티 우선 CSS 프레임워크 |
| **LocalStorage** | 브라우저에서 제공하는 클라이언트 측 데이터 저장소 |
| **Gemini API** | Google 이 제공하는 생성형 AI API |
| **Hook** | React 의 상태 및 생명주기 기능을 함수형 컴포넌트에서 사용하게 하는 메커니즘 |
| **Context API** | React 의 전역 상태 관리 솔루션 |
| **Component** | 재사용 가능한 UI 구성 요소 |
| **Props** | 부모 컴포넌트에서 자식 컴포넌트로 전달되는 데이터 |
| **State** | 컴포넌트 내부에서 관리되는 동적인 데이터 |
| **MVP** | Minimum Viable Product - 최소 기능 제품 |
| **PWA** | Progressive Web App - 네이티브 앱처럼 동작하는 웹 앱 |
| **API** | Application Programming Interface |
| **UI/UX** | User Interface / User Experience |

## **2. 시스템 기술 및 환경 (System Description)**

### **2.1. 기술 스택 (Tech Stack)**

| 구분 | 기술 | 비고 |
| :---- | :---- | :---- |
| **Frontend** | React, Vite | 빠른 빌드 및 컴포넌트 기반 개발 |
| **Styling** | CSS / Tailwind CSS | (권장) 반응형 디자인 및 테마 커스터마이징 |
| **AI Engine** | Google Gemini API | 감정 분석, 태그 추출, 상관관계 분석 |
| **Data API** | Spotify Web API | 감정/태그 기반 음악 검색 및 추천 |
| **Storage** | LocalStorage | 브라우저 내 데이터 영구 저장 (No Backend) |
| **Visualization** | Chart.js (or Recharts) | 감정 통계 및 상관관계 시각화 |
| **Tool** | VS Code, Figma | 개발 및 디자인 |

### **2.2. 제품 기능 개요 (Product Functions Overview)**
Haru Node 는 다음의 주요 기능을 제공한다. 기능은 우선순위에 따라 P0(필수), P1(주요), P2(향후)로 분류된다.

**P0 - 필수 기능 (Mandatory Features)**
| 기능 | 설명 | AI 활용 | 난이도 |
| :--- | :--- | :--- | :--- |
| **일기 관리** | 일기 생성/수정/삭제 및 조회 (CRUD) | - | 중 |
| **일일 체크인** | 오늘의 기분 및 태그 기록 | - | 하 |
| **캘린더 뷰** | 월별 일기 기록 현황 및 기분 시각화 | - | 중 |
| **데이터 영속성** | LocalStorage 저장/불러오기 | - | 하 |

**P1 - 주요 기능 (Major Features - 추가 개발 시)**
| 기능 | 설명 | AI 활용 | 난이도 |
| :--- | :--- | :--- | :--- |
| **AI 감성 분석** | 일기 내용 분석 및 위로/격려 코멘트 생성 | 맞춤형 메시지 생성 (Gemini) | 상 |
| **음악 추천** | 감정 및 태그 기반 Spotify 음악 추천 | 검색 키워드 추출 (Gemini) | 상 |
| **통계 대시보드** | 월별 기분 흐름 및 태그 통계 차트 | - | 중 |
| **뱃지 시스템** | 활동(연속 기록, 감정 다양성 등)에 따른 보상 | - | 중 |
| **공유 기능** | 일기를 이미지 카드로 저장 및 공유 | - | 중 |

### **2.4. 운영 환경 (Operating Environment)**
*   **Client**: Chrome, Edge, Safari, Firefox 등 Modern Web Browser (ES6+ 지원).
*   **Device**: PC, Tablet, Mobile (Responsive Design 지원).
*   **Server**: Server-less Architecture (Static Web Hosting).
*   **Runtime**: Browser JavaScript Runtime (React 19).

### **2.5. 설계 및 구현 제약사항 (Design and Implementation Constraints)**
*   **Backend**: 별도의 백엔드 서버를 구축하지 않으며, 모든 데이터는 브라우저의 `localStorage`에 저장한다 (Data Persistence).
*   **Network**: Gemini API 및 외부 API 호출을 위해 인터넷 연결이 필수적이다.
*   **Quota**: Gemini API의 무료 사용량 한도(Quota) 내에서 동작하도록 최적화해야 한다 (캐싱 등).
*   **Design**: Tailwind CSS를 사용하여 스타일링하며, 모바일 우선(Mobile First) 디자인을 지향하지 않더라도 모바일 뷰포트에서 깨짐이 없어야 한다.

### **2.6. 가정 및 의존성 (Assumptions and Dependencies)**
*   **Assumptions**:
    *   사용자는 개인 기기(PC/Mobile)를 사용하며, 브라우저 데이터를 임의로 삭제하지 않는다고 가정한다.
    *   사용자는 유효한 Gemini API Key를 보유하고 있거나, 배포 시 환경 변수로 제공된다.
*   **Dependencies**:
    *   **Google Gemini API**: 감정 분석, 태그 추출, 멘트 생성, 음악 추천 로직의 핵심 의존성.
    *   **Browser LocalStorage**: 데이터 영구 저장을 위한 유일한 저장소.

## **3. 상세 요구사항 (Detailed Requirements)**

### **3.1. 기능 요구사항 (Functional Requirements)**

#### **F1. 일기 작성 및 관리 (Diary Management)**
*   **감정 기록 (Mood Logging)**: 5단계 감정(행복, 신남, 편안, 그저, 우울 등) 선택 UI 및 이모지 피드백.
*   **내용 작성**: 텍스트 에디터를 통한 일기 본문 작성.
*   **태그 (Tagging)**: 추천 태그 선택 및 사용자 커스텀 태그 추가 기능.
*   **CRUD**: 작성된 일기의 조회, 수정, 삭제 기능.

#### **F2. 캘린더 및 대시보드 (Calendar & Dashboard)**
*   **월간 뷰**: 캘린더 형태의 감정 흐름 조망.
*   **감정 색상**: 날짜별 대표 감정에 따른 색상 코딩 (커스터마이징 가능).

#### **F3. AI 분석 및 인사이트 (AI Analysis & Insights)**
*   **감정 분포 차트**: 차트(Line Chart 등)를 활용한 감정 추이 시각화.
*   **AI 코멘트**: Gemini를 이용한 일기 내용 분석 및 위로/공감 멘트 생성.
*   **영화 명대사 추천**: 사용자의 기분 상태에 맞는 영화 명대사 추천 (Gemini).

#### **F4. 음악 추천 (Music Recommendation)**
*   **Context 기반 추천**: 현재 기분과 태그를 조합하여 어울리는 음악 추천.
*   **이력 관리**: 추천받은 음악의 이력 저장 및 중복 추천 방지 (Cool-down 로직).

#### **F5. 게이미피케이션 (Gamification)**
*   **뱃지 시스템**: 특정 조건(작심삼일 탈출, 감정 표현가, 얼리버드 등) 달성 시 뱃지 자동 부여.
*   **나의 성취 뷰**: 획득한 뱃지 목록 조회.

#### **F6. 공유 및 내보내기 (Share & Export)**
*   **카드 이미지 생성**: 일기 내용을 예쁜 카드 형태의 이미지로 캡처 및 저장.
*   **소셜 공유**: 이미지 공유 기능을 통한 외부 앱 공유.
*   **데이터 백업**: 전체 데이터를 JSON 파일로 내보내기(Export) 및 가져오기(Import) 기능.

#### **F7. 설정 (Settings)**
*   **알림 설정**: 브라우저 알림 권한 요청 및 상태 표시.
*   **데이터 관리**: 데이터 초기화 및 백업 메뉴 제공.

### **3.2. 비기능 요구사항 (Non-Functional Requirements)**
*   **Performance**: 초기 로딩 속도 2초 이내 (LCP), 인터랙션 반응 속도 100ms 이내 (INP).
*   **Privacy**: 사용자의 모든 민감한 일기 데이터는 서버로 전송되지 않고 클라이언트(로컬)에만 저장됨.
*   **Reliability**: 네트워크 오프라인 상태에서도 기존 데이터 조회는 가능해야 함 (API 기능 제외).
*   **Usability**: 직관적인 UI/UX 제공 (미니멀리즘 디자인, 불필요한 뎁스 최소화).
*   **Scalability**: LocalStorage 용량(약 5MB) 한계 내에서 효율적인 데이터 구조 설계.

### **3.3. 인터페이스 요구사항 (Interface Requirements)**

#### **3.3.1. 사용자 인터페이스 (User Interface)**
| 인터페이스 | 목적 | 사용 방법 |
| :--- | :--- | :--- |
| **React** | UI 컴포넌트 구축 | JSX, Hooks (useState, useEffect, useContext, useRef) |
| **React Router** | SPA 라우팅 | BrowserRouter, Routes, Route, useNavigate |
| **Tailwind CSS** | 스타일링 | 유틸리티 클래스 (bg-*, text-*, flex, grid 등) |
| **Chart.js** | 차트 시각화 (감정 분포) | Line Chart, Custom Plugin (Emoji) |
| **Lucide React** | 아이콘 제공 | Icon Component (Bell, Download, Share2 etc.) |
| **HTML-to-Image** | 이미지 캡처 | toBlob, toPng (DOM 요소를 이미지로 변환) |

#### **3.3.2. 외부 API 인터페이스 (External API Interface)**
| 항목 | 내용 |
| :--- | :--- |
| **API 엔드포인트** | 1. Gemini: `https://generativelanguage.googleapis.com`<br>2. Spotify: `https://api.spotify.com/v1` |
| **인증 방식** | 1. Gemini: API Key (Query Param)<br>2. Spotify: OAuth 2.0 Client Credentials (Bearer Token) |
| **요청 형식** | JSON (POST/GET) |
| **응답 형식** | JSON |
| **타임아웃** | 15초 (safeFetch 기본 설정) |
| **에러 처리** | HTTP 상태 코드별 한글 에러 메시지 매핑 (404, 500, Network Error 등) |

#### **3.3.3. 데이터 인터페이스 (LocalStorage)**
**LocalStorage Key 구조**

*   `haru-node-logs`: 일기 데이터 배열 (id, date, mood, content, tags 등)
*   `haru-node-mood-colors`: 사용자 커스텀 기분 색상 매핑 정보
*   `haru-node-music-history`: 음악 추천 이력 (중복 추천 방지용)
*   `ai_insights_cache_*`: AI 분석 결과 캐싱 (불필요한 API 호출 방지)

### **3.4. AI 프롬프트 전략 (AI Prompt Strategy)**

**Gemini API 호출 시 다음 정보를 컨텍스트로 제공한다:**

*   **사용자 기분 (Mood)**: "행복", "우울", "차분함" 등 사용자가 선택한 오늘의 감정 상태
*   **활동 태그 (Tags)**: #운동, #독서, #친구 등 기분과 연관된 활동 키워드
*   **현재 메모 (Memo)**: 사용자가 직접 작성한 일기 본문 (맥락 파악용)
*   **과거 기록 (History)**: 최근 50일간의 감정 흐름 및 태그 사용 패턴 (장기 분석용)
*   **추천 이력 (Log)**: 최근 추천된 명대사 목록 (중복 추천 방지)

**프롬프트 예시 (음악 키워드 추출):**
```text
사용자의 현재 기분: 우울
선택한 태그: #비오는날, #휴식
메모: 오늘은 하루종일 비가 와서 기분이 처진다.

위 정보를 바탕으로 Spotify에서 검색하기 좋은 음악 키워드 5개를 추천해줘.
형식은 쉼표로 구분된 영어 키워드만 출력해. (예: Jazz, Relaxing Piano, Upbeat Pop)
설명이나 다른 말은 하지 마.
```

**프롬프트 예시 (심층 습관 분석):**
```text
다음은 사용자의 최근 일기 및 기분 기록이야 (최신순):
- 2025. 11. 19. / 기분: 우울 / 태그: #비, #음악 / 내용: 비가 와서 그런지 기분이 가라앉는다.
- 2025. 11. 18. / 기분: 신남 / 태그: #친구, #카페 / 내용: 친구랑 수다 떨어서 스트레스 풀림!

이 기록을 심층적으로 분석해서 다음 3가지 항목을 JSON 형식으로 줘.
1. tagEmotion: 사용자가 자주 사용하는 태그와 그때의 감정 패턴, 인과관계 분석
2. musicTaste: 사용자의 기분 변화와 패턴에 기반한 정교한 음악 취향 추천
3. overall: 사용자의 멘탈 케어와 성장을 위한 따뜻하고 전문적인 심리 조언 한마디
```

### **3.5. Spotify API 활용 전략 (Spotify API Strategy)**

**1. Authentication (인증)**
*   **Client Credential Flow**: Server-less 환경이므로 Client ID와 Client Secret을 사용하여 Access Token을 발급받는다.
*   **Token Management**: 발급받은 토큰은 메모리에 저장하며, 만료 시간(1시간)을 체크하여 자동 갱신 로직을 구현한다.

**2. Search Query (검색 쿼리)**
*   **Source**: Gemini가 3.4 전략에 따라 생성한 '음악 키워드' (예: "Jazz", "Rainy Day", "Acoustic")를 사용한다.
*   **Method**: `GET /search` 엔드포인트를 호출한다.
*   **Parameters**:
    *   `q`: Gemini가 추천한 키워드 (URL Encoding 필수)
    *   `type`: `track` (개별 곡 검색)
    *   `limit`: `5` (상위 5개 결과만 노출)

**3. Data Processing (데이터 가공)**
*   **Extraction**: API 응답에서 다음 핵심 정보만 추출하여 UI에 표시한다.
    *   Track Name (곡 제목)
    *   Artist Name (가수)
    *   Album Art (앨범 커버 이미지 - 640px/300px/64px 중 적절한 사이즈 선택)
    *   Preview URL (30초 미리듣기 링크 - `null`일 경우 처리 로직 필요)
    *   External URL (Spotify 앱/웹으로 이동하는 딥링크)

## **4. 향후 확장 기능 (Future Extensions) - P3**
*   **Cloud Sync**: Firebase/Supabase 등을 연동하여 기기 간 데이터 동기화.
*   **Mobile App**: React Native 또는 PWA(Progressive Web App) 설치 지원 강화.
*   **Community**: 익명 감정 공유 피드 (대나무숲 기능).
*   **Voice Log**: 음성 인식을 통한 일기 작성 (STT).
*   **PDF Export**: 월간 기록을 책자 형태의 PDF로 변환.

## **5. 성공 지표 및 측정 (Success Metrics)**

### **5.1. 핵심 지표 (Key Metrics)**
| 지표 | 목표 | 측정 방법 | 수집 시점 |
| :--- | :--- | :--- | :--- |
| **DAU (일일 활성 사용자)** | 70% | LocalStorage 접근 로그 | 매일 |
| **일기 작성 완료율** | 60%+ | (작성 완료 일기 / 전체 방문) × 100 | 실시간 |
| **평균 세션 시간** | 3분+ | 페이지 체류 시간 (선택) | 매 세션 |
| **7일 리텐션** | 40%+ | 7일 후 재방문율 | 주간 |

### **5.2. 단계별 목표 (Phase Targets)**
| 기간 | 목표 | 측정 지표 |
| :--- | :--- | :--- |
| **Week 11-14**<br>(개발 기간) | • MVP 기능 100% 완성<br>• 코드 리뷰 통과<br>• Lighthouse 성능 85+ 달성 | 프로젝트 완료도 |
| **1개월 후** | • 5명 이상 실제 사용<br>• 평균 완료율 50%+<br>• 버그 0건 | 사용자 피드백 |

### **5.3. 학습 목표 달성도 (Educational Goals)**
*   **React Hooks** (useState, useEffect, useContext) 완전 이해 및 활용
*   **React Router**를 활용한 SPA 구현 및 라우팅 관리
*   **Tailwind CSS**를 사용한 반응형 디자인 구현
*   **REST API** 통신 및 비동기 처리 (fetch/axios, async/await)
*   **LocalStorage**를 활용한 클라이언트 측 데이터 관리
*   **Git/GitHub**를 통한 버전 관리 및 협업
*   **Vercel 또는 Netlify**를 통한 프로덕션 배포 경험
*   **실무 수준의 React 프로젝트** 포트폴리오 완성
*   **AI API (Gemini)** 통합 경험 및 프롬프트 엔지니어링 이해

## **6. 요구사항 추적성 매트릭스 (Requirement Traceability Matrix)**
요구사항과 구현 요소 간의 추적성을 제공하여 모든 요구사항이 충족되었는지 확인한다.

| 요구사항 ID | 구현 요소 (Component/Service) | 검증 방법 | 상태 |
| :--- | :--- | :--- | :--- |
| **F1** (일기) | `DiaryPage`, `WriteDiaryForm`, `DailyCardModal` | UI 테스트 | 완료 |
| **F2** (캘린더) | `CalendarPage`, `Calendar.css` | UI 테스트 | 완료 |
| **F3** (분석) | `AnalysisPage`, `geminiApi.js` | 통합 테스트 | 완료 |
| **F4** (음악) | `MusicRecommender`, `spotifyApi.js` | 통합 테스트 | 완료 |
| **F5** (뱃지) | `BadgeList`, `HabitContext` (Badge Logic) | 단위 테스트 | 완료 |
| **F6** (공유) | `ShareModal`, `shareUtils.js` | 사용성 테스트 | 완료 |
| **F7** (설정) | `SettingsPage`, `SettingsModal` | UI 테스트 | 완료 |
| **NFR-Performance** | `React.memo`, `useMemo` (All Components) | Lighthouse | 진행 중 |
| **NFR-Privacy** | `localStorageUtils.js` | 보안 검토 | 완료 |
| **UI-Responsive** | Tailwind CSS (`sm:`, `md:`, `lg:`) | 브라우저 테스트 | 완료 |
| **Data-Model** | `HabitContext` (Entries State) | 코드 리뷰 | 완료 |
| **All** | `README.md` | 문서 리뷰 | 작성 중 |

## **7. AI 협업 전략 (R&R)**

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

## **8. 개발 일정 (Timeline)**

* **~ 11.19**: Figma 디자인 구체화, 프로젝트 초기 세팅 (Vite).
* **11.20 ~ 11.24**: P0 필수 기능 구현 (감정/태그 입력, LocalStorage 연동).
* **11.25 ~ 11.30**: P1 주요 기능 구현 (Spotify API 연동, Gemini 분석 모듈).
* **12.01 ~ 12.07**: UI/UX 폴리싱, 버그 수정, 최종 테스트 및 문서화.

---

# **부록 (Appendices)**

## **부록 A. 용어집 (Appendix A: Glossary)**

| 용어 | 정의 |
| :--- | :--- |
| **일기 (Diary/Entry)** | 사용자가 매일 감정, 태그, 내용을 기록하는 데이터 단위 |
| **감정 (Mood)** | 사용자의 하루 기분 상태 (행복, 신남, 편안, 그저, 우울 등) |
| **태그 (Tag)** | 감정과 연관된 활동이나 상태를 나타내는 키워드 (#운동, #독서 등) |
| **뱃지 (Badge)** | 사용자의 꾸준한 기록 활동에 대해 부여되는 보상 아이템 |
| **컴포넌트 (Component)** | React에서 UI를 구성하는 재사용 가능한 코드 블록 |
| **상태 (State)** | 컴포넌트 내부에서 관리되는 동적인 데이터 (useState) |
| **프롭스 (Props)** | 부모 컴포넌트에서 자식으로 전달되는 데이터 |
| **훅 (Hook)** | React 함수형 컴포넌트에서 상태와 생명주기를 다루는 함수 |
| **라우팅 (Routing)** | URL에 따라 다른 페이지(컴포넌트)를 표시하는 기능 |
| **SPA (Single Page Application)** | 페이지 전환 없이 동작하는 웹 앱 |
| **LocalStorage** | 브라우저에 데이터를 저장하는 웹 스토리지 API |
| **API (Application Programming Interface)** | 소프트웨어 간 통신 규약 (Gemini, Spotify) |
| **Gemini** | Google의 생성형 AI 모델 (감정 분석 및 멘트 생성) |
| **Tailwind CSS** | 유틸리티 클래스 기반 CSS 프레임워크 |
| **Vite** | 빠른 개발 서버를 제공하는 빌드 도구 |
| **Lucide React** | 프로젝트에서 사용하는 오픈소스 아이콘 라이브러리 |
| **Chart.js** | 데이터 시각화(감정 분포 그래프)를 위한 JavaScript 라이브러리 |
| **html-to-image** | DOM 요소를 이미지 파일(PNG/JPEG)로 변환해주는 라이브러리 |
| **ESLint** | JavaScript 코드의 문법 오류와 스타일 문제를 검사하는 정적 분석 도구 |
| **JSON (JavaScript Object Notation)** | 데이터 교환을 위한 경량의 데이터 형식 |
| **DOM (Document Object Model)** | 웹 페이지의 구조를 표현하는 객체 모델 |
| **Git** | 소스 코드 버전 관리를 위한 분산 버전 관리 시스템 |
| **GitHub** | Git 저장소를 호스팅하고 협업 기능을 제공하는 클라우드 서비스 |
| **Lighthouse** | 웹 앱의 성능, 접근성, SEO 등을 진단하는 자동화 도구 |
| **비동기 처리 (Asynchronous)** | 특정 코드의 실행 완료를 기다리지 않고 다음 코드를 실행하는 프로그래밍 방식 (Promise, async/await) |
| **배포 (Deployment)** | 개발한 애플리케이션을 사용자가 접근할 수 있는 환경(서버/클라우드)에 올리는 과정 |
| **반응형 디자인 (Responsive Design)** | 다양한 화면 크기(모바일, 태블릿, 데스크탑)에 맞춰 레이아웃이 유동적으로 변하는 디자인 |
| **온보딩 (Onboarding)** | 신규 사용자가 앱의 가치와 사용법을 익히도록 돕는 초기 적응 과정 |
| **리팩토링 (Refactoring)** | 외부 동작은 유지하면서 내부 코드 구조를 개선하는 작업 |
| **커스텀 훅 (Custom Hook)** | 여러 컴포넌트에서 재사용할 수 있도록 로직을 분리하여 만든 사용자 정의 훅 |

## **부록 B. 분석 모델 (Appendix B: Analysis Model)**

### **B.1. 도메인 모델 (Domain Model) -> Data Schema**
| 엔티티 (Entity) | 속성 (Attributes) | 관계 (Description) |
| :--- | :--- | :--- |
| **Entry** | `id`, `date`, `timestamp`, `mood`, `content`, `tags`, `musicRecommendation` | 핵심 데이터 모델 (N) |
| **MusicRecommendation** | `genre`, `track`, `artist`, `previewUrl` | Entry에 종속 (1 : 1) |
| **Badge** | `id`, `name`, `description`, `icon`, `acquiredAt` | 사용자 성취 보상 (Independent) |
| **Settings** | `theme`, `notifications`, `isAlarmOn` | 앱 설정 (Singleton) |
| **AICache** | `key`, `response`, `timestamp` | API 호출 최적화 (Independent) |

### **B.2. 화면 흐름도 (Screen Flow)**
**주요 사용자 시나리오:**

*   **신규 사용자**: 앱 접속 → 온보딩(첫 기록 유도) → 일기 작성 모달 → 감정/태그 선택 → AI 코멘트 확인 → 저장
*   **일상 사용**: 앱 접속 → 캘린더 확인 → "+" 버튼 클릭 → 오늘의 기록 작성 → 음악 추천 확인 → 종료
*   **분석 확인**: 분석 탭 클릭 → 이번 달 감정 차트 확인 → 나의 성취(뱃지) 확인 → AI 상세 리포트 열람

## **부록 C. Gemini API 명세 (Appendix C: Gemini API Specification)**

### **Google Gemini API 사용 예시:**

**요청 예시 (Request):**
```http
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY
```
```json
{
  "contents": [{
    "parts": [{
      "text": "오늘은 2025년 12월 13일입니다. 사용자는 '우울'한 기분이며 '#비', '#휴식' 태그를 선택했습니다. 위로가 되는 따뜻한 한마디를 50자 이내로 작성해주세요."
    }]
  }],
  "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 100
  }
}
```

**응답 예시 (Response):**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "비 오는 날은 마음도 차분해지죠. 따뜻한 차 한 잔과 함께 깊은 휴식을 취해보세요. 내일은 더 맑을 거예요. ☕️"
      }]
    }
  }]
}
```

### **에러 처리 (Error Handling):**

*   **400 Bad Request**: API 프로토콜 위반 또는 잘못된 JSON 형식 (요청 검증 필요).
*   **401 Unauthorized**: API 키 누락 또는 유효하지 않은 키 (환경 변수 확인).
*   **429 Too Many Requests**: 분당 요청 횟수 초과 (Quota Exceeded) -> **캐시 사용 또는 지수 백오프(Exponential Backoff) 재시도 로직 적용**.
*   **500 Server Error**: Google 서버 내부 오류 -> **5초 대기 후 최대 3회 재시도**.
*   **Timeout**: 15초 응답 없음 -> **SafeFetch 타임아웃 발생 -> Fallback 메시지("AI 서버가 응답하지 않습니다") 표시**.

---

### **💡 VS Code 설정 팁 (개발 시작 전)**

1.  **프로젝트 생성**:
    ```bash
    npm create vite@latest haru-node -- --template react
    cd haru-node
    npm install
    ```
2.  **필요한 라이브러리 설치** (터미널에 입력):
    ```bash
    # 아이콘 사용
    npm install lucide-react
    # 라우팅 (필요 시)
    npm install react-router-dom
    # 차트 라이브러리 (P1 단계)
    npm install recharts
    # 스타일링 (Tailwind CSS 추천)
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

## **Rules**
1. **MVVM 엄수**
2. **한글 주석** : 학생용 교육 코드
3. **KISS** : 불필요한 복잡성 회피 및 직관적인 디자인
4. **DRY** : 전체 프로젝트에서 반복되는 동일 코드가 없도록 주의