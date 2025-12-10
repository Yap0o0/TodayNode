import { safeFetch } from './apiClient';

// Gemini API 설정
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


/**
 * Gemini API를 호출하여 텍스트를 생성합니다. (Fallback 지원)
 */
/**
 * Gemini API를 호출하여 텍스트를 생성합니다. (Fallback 지원)
 * @param {string} prompt 프롬프트 텍스트
 * @param {string} model 사용할 모델명 (기본값: gemini-2.5-flash)
 */
const fetchWithFallback = async (prompt, model = 'gemini-2.5-flash') => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing!");
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  // API 키 공백 제거
  const apiKey = API_KEY.trim();

  let lastError = null;

  try {
    // 모델별 URL 생성 (동적 모델 적용)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const { data, error } = await safeFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!error && data) {
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      }
    } else {
      console.warn(`Gemini API request failed (${model}):`, error);
      lastError = new Error(error || "Unknown error");
    }
  } catch (err) {
    console.warn(`Gemini API exception (${model}):`, err);
    lastError = err;
  }

  throw lastError || new Error("API 요청에 실패했습니다.");
};

/**
 * JSON 응답을 파싱하는 헬퍼 함수
 */
const parseJSON = (text) => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON Parsing Failed:", error);
    console.error("Raw Text:", text);
    throw new Error("AI 응답을 분석할 수 없습니다.");
  }
};

/**
 * 사용자의 기분과 태그를 바탕으로 음악 검색 키워드를 생성합니다.
 * **사용 모델: gemini-2.5-flash (속도 중시)**
 */
export const generateMusicKeywords = async (mood, tags, memo) => {
  const prompt = `
    사용자의 현재 기분: ${mood}
    선택한 태그: ${tags.join(', ')}
    메모: ${memo}

    위 정보를 바탕으로 Spotify에서 검색하기 좋은 음악 키워드 5개를 추천해줘.
    형식은 쉼표로 구분된 영어 키워드만 출력해. (예: Jazz, Relaxing Piano, Upbeat Pop)
    설명이나 다른 말은 하지 마.
  `;

  try {
    // 음악 추천은 속도가 중요하므로 2.5 Flash 사용
    const text = await fetchWithFallback(prompt, 'gemini-2.5-flash');
    return text.split(',').map(k => k.trim());
  } catch (error) {
    console.error("Gemini API 음악 키워드 생성 실패:", error);
    return ['Pop', 'K-Pop', 'Ballad', 'OST', 'Indie'];
  }
};

/**
 * 사용자의 최근 기록을 바탕으로 맞춤형 조언을 생성합니다.
 * **사용 모델: gemini-3.0-pro (심층 분석 중시)**
 */
export const analyzeHabits = async (entries) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  // 3.0 Pro는 컨텍스트가 더 길 수 있으므로 50개까지 확장
  const recentEntries = sortedEntries.slice(0, 50).map(e => {
    const date = new Date(e.timestamp).toLocaleDateString();
    const tags = e.tags ? e.tags.join(', ') : '없음';
    const content = e.content ? (e.content.length > 50 ? e.content.substring(0, 50) + '...' : e.content) : '없음';
    return `- ${date} / 기분: ${e.mood} / 태그: ${tags} / 내용: ${content}`;
  }).join('\n');

  console.log(`Analyzing ${sortedEntries.slice(0, 50).length} entries with Gemini 3.0 Pro.`);

  const prompt = `
    다음은 사용자의 최근 일기 및 기분 기록이야 (최신순):
    ${recentEntries}

    이 기록을 심층적으로 분석해서 다음 3가지 항목을 JSON 형식으로 줘.
    
    1. tagEmotion: 사용자가 자주 사용하는 태그와 그때의 감정 패턴, 인과관계를 통찰력 있게 분석 (3개 항목의 배열)
    2. musicTaste: 사용자의 기분 변화와 패턴에 기반한 정교한 음악 취향 추천 (3개 항목의 배열)
    3. overall: 사용자의 멘탈 케어와 성장을 위한 따뜻하고 전문적인 심리 조언 한마디 (문자열)

    응답 형식 (JSON):
    {
      "tagEmotion": ["분석1", "분석2", "분석3"],
      "musicTaste": ["음악취향1", "음악취향2", "음악취향3"],
      "overall": "전문적인 조언"
    }

    반드시 유효한 JSON만 출력해.
  `;

  try {
    // 분석은 퀄리티가 중요하므로 3.0 Pro 사용
    const text = await fetchWithFallback(prompt, 'gemini-3.0-pro');
    return parseJSON(text);
  } catch (error) {
    console.error("Gemini API 분석 요청 실패:", error);
    console.log("로컬 분석 로직을 실행합니다.");
    const localInsights = generateLocalInsights(entries);
    if (localInsights) return localInsights;

    return {
      tagEmotion: ["데이터가 부족하여 분석할 수 없습니다."],
      musicTaste: ["데이터가 부족하여 분석할 수 없습니다."],
      overall: "조금 더 기록을 쌓아보세요!"
    };
  }
};

/**
 * 오늘의 기분에 어울리는 영화 명대사를 추천합니다.
 * **사용 모델: gemini-3.0-pro (감성 중시)**
 * @param {string} todaysMood - 오늘의 기분
 * @param {string[]} recentQuotes - 최근 추천받은 명대사 목록 (중복 방지용)
 */
export const recommendMovieQuote = async (todaysMood, recentQuotes = []) => {
  const prompt = `
    오늘 사용자의 기분은 '${todaysMood}'야.
    이 기분에 깊이 공감하고, 마음을 울릴 수 있는 영화 명대사를 추천해줘.
    단순한 격언보다는 영화 특유의 감성이 묻어나는 대사가 좋아.
    (Random Seed: ${Math.random()})
    
    최근 추천된 목록은 제외해줘: ${recentQuotes.join(', ')}
    
    응답 형식 (JSON):
    {
      "quote": "명대사 내용 (한국어, 감동적인 부분)",
      "movie": "영화 제목 (한국어)",
      "reason": "이 대사가 오늘의 기분에 어울리는 이유 (감성적으로)"
    }

    반드시 유효한 JSON만 출력해.
  `;

  try {
    // 명대사 추천도 3.0 Pro 사용
    const text = await fetchWithFallback(prompt, 'gemini-3.0-pro');
    return parseJSON(text);
  } catch (error) {
    console.error("Gemini API 명대사 추천 요청 실패:", error);
    // ... Fallback logic remains same
    return fallbackLogic(recentQuotes);
  }
};

// ------------------------------------------------------------------
// Fallback Logic Implementation
// ------------------------------------------------------------------

/**
 * 로컬 데이터를 기반으로 한 간단한 분석 생성 (API 실패 시)
 */
const generateLocalInsights = (entries) => {
  if (!entries || entries.length === 0) return null;

  // 간단한 태그 집계
  const tagCounts = {};
  entries.forEach(e => {
    if (e.tags) e.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => `${tag} 태그를 자주 사용하셨네요.`);

  if (topTags.length === 0) topTags.push("태그 기록이 부족합니다.");

  return {
    tagEmotion: topTags,
    musicTaste: ["편안한 어쿠스틱", "부드러운 피아노", "잔잔한 팝"], // 기본값
    overall: "기록을 꾸준히 남기시면 더 정확한 분석을 해드릴 수 있어요. 오늘도 수고 많으셨습니다."
  };
};

/**
 * 명대사 API 실패 시 사용할 하드코딩된 명대사 목록
 */
const fallbackLogic = (recentQuotes) => {
  const quotes = [
    { quote: "내일은 내일의 태양이 뜬다.", movie: "바람과 함께 사라지다", reason: "희망찬 내일을 위해" },
    { quote: "인생은 초콜릿 상자와 같아. 무엇을 집을지 아무도 모르거든.", movie: "포레스트 검프", reason: "예측할 수 없는 인생의 즐거움" },
    { quote: "당신의 눈동자에 건배.", movie: "카사블랑카", reason: "로맨틱한 기분을 위해" },
    { quote: "후회 없는 삶을 살아요.", movie: "어바웃 타임", reason: "매 순간을 소중하게" },
    { quote: "가장 중요한 건 눈에 보이지 않아.", movie: "어린 왕자", reason: "마음의 소리를 듣기 위해" }
  ];

  // 최근 추천되지 않은 것 중 랜덤 선택
  const candidates = quotes.filter(q => !recentQuotes.includes(q.quote));
  const finalCandidates = candidates.length > 0 ? candidates : quotes;
  return finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
};
