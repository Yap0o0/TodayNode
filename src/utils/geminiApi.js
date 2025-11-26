import config from '../config';
import { safeFetch } from './apiClient';

/**
 * Gemini API를 사용하여 사용자의 기분 및 태그를 기반으로 음악 추천 키워드를 생성합니다.
 * @param {string} mood - 사용자의 현재 기분 (예: "행복", "우울")
 * @param {string[]} tags - 사용자가 선택한 태그 (예: ["공부", "카페"])
 * @param {string} content - 사용자가 작성한 메모 내용
 * @returns {Promise<string>} 음악 검색에 사용할 키워드 문자열
 */
export const generateMusicKeywords = async (mood, tags, content) => {
  const apiKey = config.gemini.apiKey;
  const fallbackKeywords = `${mood} ${tags.join(' ')}`.trim();

  if (!apiKey) {
    console.error("Gemini API Key가 설정되지 않았습니다.");
    return fallbackKeywords;
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const prompt = `사용자의 현재 기분은 "${mood}"이고, 선택한 태그는 "${tags.join(', ')}", 메모 내용은 "${content}"입니다. 이 정보를 바탕으로 Spotify에서 음악을 검색할 때 사용할 만한 5개 이하의 핵심 키워드(장르, 분위기, 아티스트, 활동 등)를 쉼표로 구분하여 생성해 주세요. 예를 들어, '행복, 운동'이면 '신나는 팝, 댄스, 활기찬'처럼 응답합니다.`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 100,
    }
  };

  const { data, error } = await safeFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  if (error) {
    console.error('Gemini API 요청 실패:', error);
    // 사용자에게 에러를 알리는 로직을 추가할 수 있습니다 (예: UI에 메시지 표시)
    return fallbackKeywords; // API 실패 시 기본 키워드 반환
  }

  try {
    // Gemini API의 응답 구조에 따라 생성된 텍스트를 추출합니다.
    const text = data.candidates[0].content.parts[0].text;
    return text.trim();
  } catch (e) {
    console.error('Gemini API 응답 파싱 실패:', e);
    return fallbackKeywords; // 응답 구조가 예상과 다를 경우 기본 키워드 반환
  }
};

/**
 * 사용자의 습관 기록을 분석하여 인사이트를 생성합니다.
 * @param {Array} entries - 사용자 기록 배열
 * @returns {Promise<object>} 분석 결과 객체 (tagEmotion, musicTaste, overall)
 */
export const analyzeHabits = async (entries) => {
  const apiKey = config.gemini.apiKey;

  // 기본 응답 (에러 발생 시 또는 데이터 부족 시)
  const fallbackInsights = {
    tagEmotion: ["데이터가 부족하여 분석할 수 없습니다."],
    musicTaste: ["데이터가 부족하여 분석할 수 없습니다."],
    overall: "더 많은 기록을 남겨주시면 정확한 분석을 제공해드릴 수 있어요."
  };

  if (!entries || entries.length < 3) {
    return fallbackInsights;
  }

  if (!apiKey) {
    console.error("Gemini API Key가 설정되지 않았습니다.");
    return { ...fallbackInsights, overall: "API 키가 설정되지 않아 분석할 수 없습니다." };
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  // 분석을 위한 프롬프트 데이터 구성
  // 최근 30개의 기록만 분석에 사용 (토큰 제한 고려)
  const recentEntries = entries.slice(-30).map(entry => ({
    date: entry.date,
    mood: entry.mood,
    tags: entry.tags,
    music: entry.musicRecommendation ? entry.musicRecommendation.map(m => m.name).join(', ') : ''
  }));

  const prompt = `
    다음은 사용자의 최근 일기 기록 데이터입니다 (JSON 형식):
    ${JSON.stringify(recentEntries)}

    이 데이터를 분석하여 다음 3가지 항목에 대한 인사이트를 JSON 형식으로 제공해주세요.
    응답은 오직 JSON 문자열만 반환해야 하며, 마크다운 코드 블록(\`\`\`json)을 포함하지 마세요.

    1. tagEmotion: 태그와 감정의 상관관계 (예: "#운동 태그가 있을 때 주로 '행복' 감정이었습니다.") - 배열 형태
    2. musicTaste: 감정과 추천 음악의 관계 또는 음악 취향 (예: "'우울'할 때 차분한 음악을 추천받았습니다.") - 배열 형태
    3. overall: 전체적인 생활 패턴이나 조언 (한 문장)

    응답 예시:
    {
      "tagEmotion": ["#커피 태그와 함께 '여유' 감정이 자주 나타납니다."],
      "musicTaste": ["신나는 기분일 때 댄스 음악이 많았습니다."],
      "overall": "전반적으로 긍정적인 한 주를 보내셨군요!"
    }
  `;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  };

  const { data, error } = await safeFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  if (error) {
    console.error('Gemini API 분석 요청 실패:', error);
    return fallbackInsights;
  }

  try {
    let text = data.candidates[0].content.parts[0].text;
    // 마크다운 코드 블록 제거 (혹시 포함될 경우)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(text);
    return result;
  } catch (e) {
    console.error('Gemini API 분석 응답 파싱 실패:', e);
    return fallbackInsights;
  }
};
