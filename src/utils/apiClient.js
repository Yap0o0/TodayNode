/**
 * @file apiClient.js
 * @description API 요청을 위한 중앙 집중식 네트워크 클라이언트
 * 
 * 이 파일은 앱의 모든 HTTP 요청을 처리하는 `safeFetch` 함수를 제공합니다.
 * 이 함수는 `fetch` API를 기반으로 하며, 다음과 같은 기능을 포함합니다:
 * 1. 요청 및 응답에 대한 타임아웃 처리
 * 2. 네트워크 연결 실패, 서버 오류(4xx, 5xx), 데이터 파싱 실패 등 다양한 에러 시나리오 처리
 * 3. 모든 에러를 사용자가 이해할 수 있는 한글 메시지로 변환하여 반환
 * 4. 일관된 응답 형식({ data: T | null, error: string | null }) 제공
 */

/**
 * 에러 유형에 따라 사용자에게 보여줄 한글 에러 메시지를 반환합니다.
 * @param {Error} error - 발생한 에러 객체
 * @param {Response|null} response - HTTP 응답 객체
 * @returns {string} 사용자 친화적인 한글 에러 메시지
 */
const getFriendlyErrorMessage = (error, response = null) => {
  // HTTP 상태 코드에 따른 메시지
  if (response) {
    if (response.status >= 500) {
      return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
    if (response.status === 404) {
      return '요청하신 내용을 찾을 수 없습니다.';
    }
    if (response.status >= 400) {
      return '잘못된 요청입니다. 입력 내용을 다시 확인해주세요.';
    }
  }

  // 네트워크 및 기타 에러
  if (error.name === 'AbortError') {
    return '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
  }
  if (error instanceof TypeError) { // 네트워크 실패, CORS, 잘못된 URL 등
    return '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.';
  }
  
  // 데이터 파싱 에러 (SyntaxError)
  if (error instanceof SyntaxError) {
    return '데이터를 처리하는 중 오류가 발생했습니다.';
  }

  return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
};

/**
 * fetch를 감싸 에러 처리 및 타임아웃 기능을 추가한 비동기 함수입니다.
 * 
 * @param {string} url - 요청할 URL
 * @param {RequestInit} options - fetch 옵션 (headers, method, body 등)
 * @param {number} timeout - 요청 타임아웃 시간 (ms), 기본값 15000ms
 * @returns {Promise<{ data: T | null, error: string | null }>}
 *          성공 시 { data: T, error: null }, 실패 시 { data: null, error: '에러 메시지' }
 */
export const safeFetch = async (url, options = {}, timeout = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      return { data: null, error: getFriendlyErrorMessage(error, response) };
    }

    // 내용이 없는 응답(e.g., 204 No Content) 처리
    const text = await response.text();
    if (!text) {
      return { data: null, error: null }; // 또는 { data: {}, error: null } 등 상황에 맞게
    }

    try {
      const data = JSON.parse(text);
      return { data, error: null };
    } catch (parseError) {
      return { data: null, error: getFriendlyErrorMessage(parseError) };
    }

  } catch (networkError) {
    clearTimeout(timeoutId);
    return { data: null, error: getFriendlyErrorMessage(networkError) };
  }
};
