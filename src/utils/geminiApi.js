import { safeFetch } from './apiClient';

// Gemini API 설정
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 사용 가능한 모델 리스트 (우선순위 순)
// 404 에러 방지를 위해 여러 모델 버전을 시도합니다.
const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-pro',
  'gemini-1.0-pro'
];

/**
 * Gemini API를 호출하여 텍스트를 생성합니다. (Fallback 지원)
 */
const fetchWithFallback = async (prompt) => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing!");
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  // API 키 공백 제거 (혹시 모를 오류 방지)
  const apiKey = API_KEY.trim();

  let lastError = null;

  for (const model of MODELS) {
    try {
      // 모델별 URL 생성
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      // safeFetch는 { data, error } 객체를 반환합니다.
      const { data, error } = await safeFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      if (!error && data) {
        if (data.candidates && data.candidates.length > 0) {
          return data.candidates[0].content.parts[0].text;
        }
      } else {
        // 에러 발생 시 로그 남기고 다음 모델 시도
        console.warn(`Gemini Model ${model} failed:`, error);
        lastError = new Error(error || `Unknown error for ${model}`);
      }
    } catch (err) {
      console.warn(`Gemini Model ${model} exception:`, err);
      lastError = err;
    }
  }

  // 모든 모델 실패 시
  console.error("All Gemini models failed.");

  // 디버깅: 사용 가능한 모델 리스트 확인
  console.log("Gemini API Key Loaded:", apiKey.substring(0, 10) + "...");

  // 1. 사용 가능한 모델 리스트 확인 (디버깅용)
  try {
    const { data: modelsData, error: modelsError } = await safeFetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!modelsError && modelsData) {
      console.log("FULL_MODEL_LIST_START");
      console.log(JSON.stringify(modelsData, null, 2));
      console.log("FULL_MODEL_LIST_END");
      console.log("Available Models for this Key:", modelsData.models.map(m => m.name));
    } else {
      console.error("Failed to list models:", modelsError);
    }
  } catch (modelListError) {
    console.error("Error listing models:", modelListError);
  }

  throw lastError || new Error("모든 모델 요청에 실패했습니다.");
};

/**
 * 사용자의 기분과 태그를 바탕으로 음악 검색 키워드를 생성합니다.
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
    const text = await fetchWithFallback(prompt);
    return text.split(',').map(k => k.trim());
  } catch (error) {
    console.error("Gemini API 음악 키워드 생성 실패:", error);
    // Fallback 키워드 반환
    return ['Pop', 'K-Pop', 'Ballad', 'OST', 'Indie'];
  }
};

/**
 * 사용자의 최근 기록을 바탕으로 맞춤형 조언을 생성합니다.
 */
export const analyzeHabits = async (entries) => {
  if (!entries || entries.length === 0) {
    return "데이터가 부족하여 분석할 수 없습니다.";
  }

  // 최근 7일 데이터만 필터링
  const recentEntries = entries.slice(0, 7).map(e =>
    `- 날짜: ${new Date(e.timestamp).toLocaleDateString()} / 기분: ${e.mood} / 태그: ${e.tags ? e.tags.join(', ') : '없음'} / 내용: ${e.content || '없음'}`
  ).join('\n');

  const prompt = `
    다음은 사용자의 최근 7일간의 일기 및 기분 기록이야:
    ${recentEntries}

    이 기록을 바탕으로 사용자의 심리 상태나 패턴을 분석하고, 
    따뜻하고 도움이 되는 조언을 3문장 이내로 짧게 해줘.
    말투는 친근하고 부드러운 존댓말로 해줘.
  `;

  try {
    return await fetchWithFallback(prompt);
  } catch (error) {
    console.error("Gemini API 분석 요청 실패 (All models failed):", error);
    // 사용자에게 더 구체적인 에러 메시지 전달
    if (error.message.includes("404")) {
      return "AI 모델을 찾을 수 없습니다. (404 Error) - API 설정이나 모델 가용성을 확인해주세요.";
    } else if (error.message.includes("401") || error.message.includes("403")) {
      return "API 키 인증에 실패했습니다. 설정을 확인해주세요.";
    } else if (error.message.includes("429")) {
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    }
    return "AI 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};

/**
 * 오늘의 기분에 어울리는 영화 명대사를 추천합니다.
 */
export const recommendMovieQuote = async (todaysMood) => {
  const prompt = `
    오늘 사용자의 기분은 '${todaysMood}'야.
    이 기분에 어울리는, 위로가 되거나 힘이 되는 유명한 영화 명대사 하나를 추천해줘.
    
    형식:
    "명대사 내용" - 영화 제목

    설명 없이 딱 저 형식으로만 출력해. 한국어로 번역해서 줘.
  `;

  try {
    return await fetchWithFallback(prompt);
  } catch (error) {
    console.error("Gemini API 명대사 추천 요청 실패 (All models failed):", error);
    return '"내일은 내일의 태양이 뜰 거야." - 바람과 함께 사라지다';
  }
};
