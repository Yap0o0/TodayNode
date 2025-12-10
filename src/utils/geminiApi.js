import { safeFetch } from './apiClient';

// Gemini API 설정
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


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

  try {
    // 모델별 URL 생성
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // safeFetch는 { data, error } 객체를 반환합니다.
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
          temperature: 0.2, // 창의성 낮춤 (일관성 확보)
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
      console.warn(`Gemini API request failed:`, error);
      lastError = new Error(error || "Unknown error");
    }
  } catch (err) {
    console.warn(`Gemini API exception:`, err);
    lastError = err;
  }

  throw lastError || new Error("API 요청에 실패했습니다.");
};

/**
 * JSON 응답을 파싱하는 헬퍼 함수
 * 마크다운 코드 블록(```json ... ```)을 제거하고 파싱합니다.
 */
const parseJSON = (text) => {
  try {
    // 마크다운 코드 블록 제거
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
 * 로컬 데이터를 바탕으로 간단한 인사이트를 생성합니다. (API 실패 시 Fallback)
 */
const generateLocalInsights = (entries) => {
  if (!entries || entries.length === 0) return null;

  // 1. 최빈 감정 계산
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);

  // 2. 태그 분석 (가장 많이 쓴 태그)
  const allTags = entries.flatMap(e => e.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const topTag = Object.keys(tagCounts).length > 0
    ? Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b)
    : "특별한 활동";

  // 3. 음악 추천 매핑 (간단한 규칙)
  const musicRecommendations = {
    '행복': ['신나는 팝', '드라이브 음악', 'K-Pop 댄스'],
    '신남': ['EDM', '페스티벌 플레이리스트', '업템포 락'],
    '편안': ['어쿠스틱', '재즈', '로파이(Lo-Fi)'],
    '그저': ['잔잔한 인디', '카페 음악', '어쿠스틱 팝'],
    '우울': ['위로가 되는 발라드', '빗소리와 함께 듣는 피아노', '감성 R&B'],
    '화남': ['강렬한 락', '힙합', '스트레스 해소용 비트'],
    '기타': ['새로운 발견을 위한 인디', '월드 뮤직', '크로스오버']
  };

  const recommendedMusic = musicRecommendations[mostFrequentMood] || ['편안한 어쿠스틱', '기분 전환용 팝', '잔잔한 연주곡'];

  return {
    tagEmotion: [
      `'${mostFrequentMood}' 감정을 느낄 때 '${topTag}' 태그가 자주 보입니다.`,
      `최근 ${entries.length}개의 기록 중 '${mostFrequentMood}' 감정이 가장 많았습니다.`,
      `'${topTag}' 활동이 기분에 긍정적인 영향을 주는 것 같아요.`
    ],
    musicTaste: recommendedMusic.map(genre => `'${mostFrequentMood}' 기분에는 ${genre} 장르가 어울려요.`),
    overall: `최근 '${mostFrequentMood}' 기분을 자주 느끼셨네요. ${mostFrequentMood === '우울' || mostFrequentMood === '화남' ? '잠시 쉬어가는 시간을 가져보는 건 어떨까요?' : '지금처럼 좋은 에너지를 유지해보세요!'} 항상 응원합니다.`
  };
};

/**
 * 사용자의 최근 기록을 바탕으로 맞춤형 조언을 생성합니다.
 */
export const analyzeHabits = async (entries) => {
  if (!entries || entries.length === 0) {
    return null;
  }

  // 날짜 내림차순(최신순) 정렬
  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 최근 30일 데이터 분석 (토큰 제한 고려하여 최대 30개로 확장)
  // 데이터가 많을 경우 content를 요약하거나 길이를 제한하는 것이 좋음
  const recentEntries = sortedEntries.slice(0, 30).map(e => {
    const date = new Date(e.timestamp).toLocaleDateString();
    const tags = e.tags ? e.tags.join(', ') : '없음';
    // 내용은 50자로 제한하여 토큰 절약
    const content = e.content ? (e.content.length > 50 ? e.content.substring(0, 50) + '...' : e.content) : '없음';
    return `- ${date} / 기분: ${e.mood} / 태그: ${tags} / 내용: ${content}`;
  }).join('\n');

  console.log(`Analyzing ${sortedEntries.slice(0, 30).length} entries for AI insights.`);

  const prompt = `
    다음은 사용자의 최근 일기 및 기분 기록이야 (최신순):
    ${recentEntries}

    이 기록을 바탕으로 다음 3가지 항목을 분석해서 JSON 형식으로 줘.
    
    1. tagEmotion: 사용자가 자주 사용하는 태그와 그때의 감정 패턴 분석 (3개 항목의 배열)
    2. musicTaste: 사용자의 기분 변화에 따라 추천할 만한 음악 장르나 분위기 (3개 항목의 배열)
    3. overall: 사용자에게 해주고 싶은 따뜻하고 긍정적인 조언 한마디 (문자열)

    응답 형식 (JSON):
    {
      "tagEmotion": ["분석1", "분석2", "분석3"],
      "musicTaste": ["음악취향1", "음악취향2", "음악취향3"],
      "overall": "따뜻한 조언 한마디"
    }

    반드시 유효한 JSON만 출력해. 다른 설명은 하지 마.
  `;

  try {
    const text = await fetchWithFallback(prompt);
    return parseJSON(text);
  } catch (error) {
    console.error("Gemini API 분석 요청 실패:", error);
    console.log("로컬 분석 로직을 실행합니다.");
    const localInsights = generateLocalInsights(entries);
    if (localInsights) return localInsights;

    // 로컬 분석도 실패한 경우 (예: 데이터 부족) 기본값 반환
    return {
      tagEmotion: ["데이터가 부족하여 분석할 수 없습니다."],
      musicTaste: ["데이터가 부족하여 분석할 수 없습니다."],
      overall: "조금 더 기록을 쌓아보세요!"
    };
  }
};

/**
 * 오늘의 기분에 어울리는 영화 명대사를 추천합니다.
 * @param {string} todaysMood - 오늘의 기분
 * @param {string[]} recentQuotes - 최근 추천받은 명대사 목록 (중복 방지용)
 */
export const recommendMovieQuote = async (todaysMood, recentQuotes = []) => {
  const prompt = `
    오늘 사용자의 기분은 '${todaysMood}'야.
    이 기분에 어울리는, 위로가 되거나 힘이 되는 유명한 영화 명대사 하나를 추천해줘.
    이전과 다른 새로운 명대사를 추천해줘. (Random Seed: ${Math.random()})
    
    다음 명대사들은 최근에 추천해줬으니 제외해줘: ${recentQuotes.join(', ')}
    
    응답 형식 (JSON):
    {
      "quote": "명대사 내용 (한국어)",
      "movie": "영화 제목 (한국어)",
      "reason": "추천 이유 (짧게)"
    }

    반드시 유효한 JSON만 출력해. 다른 설명은 하지 마.
  `;

  try {
    const text = await fetchWithFallback(prompt);
    return parseJSON(text);
  } catch (error) {
    console.error("Gemini API 명대사 추천 요청 실패:", error);

    const fallbackQuotes = [
      { quote: "내일은 내일의 태양이 뜰 거야.", movie: "바람과 함께 사라지다", reason: "희망을 잃지 마세요." },
      { quote: "현재를 즐겨라. (Carpe Diem)", movie: "죽은 시인의 사회", reason: "지금 이 순간을 소중히 여기세요." },
      { quote: "인생은 초콜릿 상자와 같은 거야.", movie: "포레스트 검프", reason: "어떤 일이 일어날지 모르니까요." },
      { quote: "당신은 당신이 생각하는 것보다 더 강합니다.", movie: "곰돌이 푸", reason: "자신을 믿으세요." },
      { quote: "꿈을 꾸는 것이 가능하다면, 그것을 이루는 것도 가능하다.", movie: "월트 디즈니", reason: "꿈을 향해 나아가세요." },
      { quote: "우리가 추락하는 이유는 다시 올라가는 법을 배우기 위해서다.", movie: "배트맨 비긴즈", reason: "실패를 두려워하지 마세요." },
      { quote: "중요한 건 꺾이지 않는 마음.", movie: "중꺾마", reason: "포기하지 않으면 언젠가 닿습니다." },
      { quote: "지나간 과거는 아플 수 있어. 하지만 둘 중 하나야. 도망치든가, 극복하든가.", movie: "라이온 킹", reason: "과거에서 배우고 성장하세요." },
      { quote: "후회 없는 삶을 살아라.", movie: "어바웃 타임", reason: "매 순간을 소중히 여기세요." },
      { quote: "진정한 용기는 두려움을 모르는 것이 아니라, 두려움에도 불구하고 행동하는 것이다.", movie: "위대한 쇼맨", reason: "용기를 내세요." },
      { quote: "네가 간절히 원한다면 온 우주가 너를 도와줄 거야.", movie: "연금술사", reason: "꿈을 믿으세요." },
      { quote: "가장 어두운 밤도 언젠간 끝나고 해는 떠오른다.", movie: "다크 나이트", reason: "희망을 가지세요." },
      { quote: "너 자신을 믿어. 너는 네가 생각하는 것보다 더 대단해.", movie: "주토피아", reason: "자존감을 가지세요." },
      { quote: "상처는 아물고 흉터는 남지만, 그 흉터는 우리가 살아남았다는 증거다.", movie: "크리미널 마인드", reason: "당신은 강합니다." },
      { quote: "행복은 습관이다. 그것을 몸에 익혀라.", movie: "허버트", reason: "긍정적인 마음을 가지세요." },
      { quote: "어제는 역사고, 내일은 미스터리이며, 오늘은 선물이다.", movie: "쿵푸 팬더", reason: "현재에 집중하세요." },
      { quote: "남들이 당신을 어떻게 생각하는지는 중요하지 않다. 당신이 당신을 어떻게 생각하는지가 중요하다.", movie: "미스 리틀 선샤인", reason: "자신을 사랑하세요." },
      { quote: "기적은 매일 일어난다.", movie: "포레스트 검프", reason: "작은 행복을 찾으세요." },
      { quote: "모든 것은 결국 괜찮아질 거야. 만약 괜찮지 않다면, 아직 끝난 것이 아니다.", movie: "베스트 엑조틱 메리골드 호텔", reason: "끝까지 포기하지 마세요." },
      { quote: "당신의 인생을 사랑하라. 당신의 인생을 살아라.", movie: "밥 말리", reason: "주체적인 삶을 사세요." }
    ];

    // 최근에 추천된 명대사는 제외
    const availableQuotes = fallbackQuotes.filter(q => !recentQuotes.includes(q.quote));
    console.log(`Fallback Quotes Available: ${availableQuotes.length} / ${fallbackQuotes.length}`);

    // 만약 모든 명대사가 최근에 나왔다면 (그럴 리 없겠지만), 전체 목록에서 다시 랜덤 선택
    const pool = availableQuotes.length > 0 ? availableQuotes : fallbackQuotes;

    const randomQuote = pool[Math.floor(Math.random() * pool.length)];
    console.log("Selected Fallback Quote:", randomQuote);
    return randomQuote;
  }
};
