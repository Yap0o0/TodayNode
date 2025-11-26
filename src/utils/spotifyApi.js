import config from '../config';
import { safeFetch } from './apiClient';

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

let accessToken = null;
let tokenExpiryTime = 0;

/**
 * Spotify API에 액세스하기 위한 인증 토큰을 가져옵니다.
 * 토큰이 만료되었거나 없는 경우 새로 요청합니다.
 * @returns {Promise<string|null>} 액세스 토큰 또는 실패 시 null
 */
const getAccessToken = async () => {
  const now = new Date().getTime();
  if (accessToken && now < tokenExpiryTime) {
    return accessToken;
  }

  const { clientId, clientSecret } = config.spotify;

  if (!clientId || !clientSecret) {
    console.error("Spotify Client ID 또는 Client Secret이 설정되지 않았습니다.");
    return null;
  }

  const { data, error } = await safeFetch(SPOTIFY_ACCOUNTS_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (error) {
    console.error("Spotify 액세스 토큰 요청 중 오류 발생:", error);
    return null;
  }

  if (data && data.access_token) {
    accessToken = data.access_token;
    tokenExpiryTime = now + data.expires_in * 1000 - 60 * 1000; // 1분 일찍 만료되도록 설정
    return accessToken;
  } else {
    console.error("Spotify 액세스 토큰을 가져오는 데 실패했습니다.", data);
    return null;
  }
};

/**
 * Spotify에서 음악을 검색합니다.
 * @param {string} query - 검색어 (예: 아티스트, 곡 제목)
 * @param {string} type - 검색할 타입 (track, artist 등)
 * @param {number} limit - 가져올 결과의 최대 개수
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchSpotify = async (query, type = 'track', limit = 5) => {
  const token = await getAccessToken();
  if (!token) {
    return [];
  }

  const searchUrl = `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;

  const { data, error } = await safeFetch(searchUrl, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  if (error) {
    console.error("Spotify 검색 요청 중 오류 발생:", error);
    return [];
  }

  // type이 track인 경우, 필요한 정보만 추출
  if (type === 'track' && data && data.tracks && data.tracks.items) {
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumArt: track.album.images.length > 0 ? track.album.images[0].url : '',
      previewUrl: track.preview_url, // 미리듣기 URL
      externalUrl: track.external_urls.spotify, // Spotify 링크
    }));
  }

  return data || [];
};
