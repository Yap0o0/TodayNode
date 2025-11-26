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
