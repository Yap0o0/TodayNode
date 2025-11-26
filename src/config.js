/**
 * 환경 변수를 중앙에서 관리하고 내보내는 모듈입니다.
 * Vite는 `VITE_` 접두사가 붙은 환경 변수만 코드에서 접근할 수 있도록 합니다.
 * 
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

// Spotify API 자격 증명
const spotifyConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
};

// Gemini API 키 (향후 사용)
const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
};

// 모든 설정을 하나로 모아서 내보내기
const config = {
  spotify: spotifyConfig,
  gemini: geminiConfig,
};

// clientId 또는 clientSecret이 없는 경우 경고 메시지 출력
if (!config.spotify.clientId || !config.spotify.clientSecret) {
  console.warn(
    "Spotify API 자격 증명(Client ID, Client Secret)이 .env.local 파일에 설정되지 않았습니다. 음악 추천 기능이 작동하지 않을 수 있습니다."
  );
}


export default config;
