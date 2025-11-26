// src/utils/localStorageUtils.js

/**
 * LocalStorage에서 데이터를 로드합니다.
 * @param {string} key - LocalStorage 키
 * @param {any} defaultValue - 키에 해당하는 데이터가 없을 경우 반환할 기본값
 * @returns {any} 로드된 데이터 또는 기본값
 */
export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return defaultValue;
  }
};

/**
 * LocalStorage에 데이터를 저장합니다.
 * @param {string} key - LocalStorage 키
 * @param {any} value - 저장할 데이터
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

/**
 * LocalStorage에서 특정 키의 데이터를 삭제합니다.
 * @param {string} key - LocalStorage 키
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from local storage:", error);
  }
};
