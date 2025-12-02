// src/context/HabitContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

const HabitContext = createContext();

const LOCAL_STORAGE_KEY = 'haru-node-logs'; // PRD에 명시된 LocalStorage 키

/**
 * HabitContext의 Provider 컴포넌트입니다.
 * 애플리케이션 전반에 걸쳐 습관 및 기록 데이터를 관리하고 제공합니다.
 * LocalStorage를 통해 데이터를 영구적으로 저장합니다.
 */
export const HabitProvider = ({ children }) => {
  // 초기 상태를 LocalStorage에서 로드하거나 빈 배열로 시작합니다.
  const [entries, setEntries] = useState(() => loadFromLocalStorage(LOCAL_STORAGE_KEY, []));

  // entries 상태가 변경될 때마다 LocalStorage에 저장합니다.
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, entries);
  }, [entries]);

  // 새로운 기록을 추가하는 함수
  const addEntry = (newEntry) => {
    setEntries((prevEntries) => {
      // PRD의 Schema를 따르도록 id, timestamp 추가
      const entryWithId = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 고유 ID 생성
        timestamp: new Date().toISOString(),
        ...newEntry,
      };
      return [...prevEntries, entryWithId];
    });
  };

  // 기록을 업데이트하는 함수
  const updateEntry = (id, updatedFields) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedFields } : entry
      )
    );
  };

  // 기록을 삭제하는 함수
  const deleteEntry = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  // 뱃지 상태 관리
  const [badges, setBadges] = useState([]);

  // 뱃지 획득 로직
  useEffect(() => {
    const newBadges = [];

    // 1. 작심삼일 탈출: 일기 3개 이상
    if (entries.length >= 3) {
      newBadges.push('beginner');
    }

    // 2. 감정 표현가: 5가지 이상의 다양한 감정
    const uniqueMoods = new Set(entries.map(entry => entry.mood));
    if (uniqueMoods.size >= 5) {
      newBadges.push('emotion_master');
    }

    // 3. 기록 마스터: 총 10개 이상
    if (entries.length >= 10) {
      newBadges.push('pro_writer');
    }

    // 4. 얼리 버드: 오전 9시 이전 작성
    const hasEarlyEntry = entries.some(entry => {
      const date = new Date(entry.timestamp);
      return date.getHours() < 9;
    });
    if (hasEarlyEntry) {
      newBadges.push('early_bird');
    }

    setBadges(newBadges);
  }, [entries]);

  // 데이터 가져오기 (병합)
  const importEntries = (newEntries) => {
    setEntries((prevEntries) => {
      // ID 기반으로 중복 제거하며 병합
      const existingIds = new Set(prevEntries.map(e => e.id));
      const uniqueNewEntries = newEntries.filter(e => !existingIds.has(e.id));
      return [...prevEntries, ...uniqueNewEntries];
    });
  };

  // --- 음악 추천 이력 관리 (Advanced Logic) ---
  const MUSIC_HISTORY_KEY = 'haru-node-music-history';
  const [musicHistory, setMusicHistory] = useState(() => loadFromLocalStorage(MUSIC_HISTORY_KEY, []));

  useEffect(() => {
    saveToLocalStorage(MUSIC_HISTORY_KEY, musicHistory);
  }, [musicHistory]);

  // 음악 추천 이력 추가
  const addMusicToHistory = (musicId) => {
    setMusicHistory(prev => {
      const now = new Date().toISOString();
      // 이미 존재하는 경우 업데이트, 없으면 추가
      const filtered = prev.filter(item => item.id !== musicId);
      return [...filtered, { id: musicId, lastRecommended: now, refreshCountAtRecommendation: 0 }]; // refreshCount는 RecordPage에서 관리하거나 별도 로직 필요. 여기선 타임스탬프 위주.
    });
  };

  // 추천 가능한지 확인 (2주 쿨다운)
  const isMusicRecommendable = (musicId) => {
    const historyItem = musicHistory.find(item => item.id === musicId);
    if (!historyItem) return true;

    const lastRecommended = new Date(historyItem.lastRecommended);
    const now = new Date();
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

    return (now - lastRecommended) >= twoWeeksInMs;
  };

  // --- 기분 색상 커스터마이징 ---
  const MOOD_COLORS_KEY = 'haru-node-mood-colors';
  const defaultMoodColors = {
    happy: '#FCD34D', // Yellow
    excited: '#F87171', // Red
    calm: '#34D399', // Green
    soso: '#9CA3AF', // Gray
    depressed: '#60A5FA', // Blue
    angry: '#EF4444', // Red-600
    etc: '#A78BFA', // Purple
  };

  const [moodColors, setMoodColors] = useState(() => loadFromLocalStorage(MOOD_COLORS_KEY, defaultMoodColors));

  useEffect(() => {
    saveToLocalStorage(MOOD_COLORS_KEY, moodColors);
  }, [moodColors]);

  const updateMoodColor = (moodId, color) => {
    setMoodColors(prev => ({ ...prev, [moodId]: color }));
  };

  // Context를 통해 제공할 값
  const value = {
    entries,
    badges, // 뱃지 목록 제공
    addEntry,
    updateEntry,
    deleteEntry,
    importEntries, // 데이터 가져오기 함수 제공
    addMusicToHistory, // 음악 이력 추가
    isMusicRecommendable, // 음악 추천 가능 여부 확인
    moodColors, // 기분 색상 정보
    updateMoodColor, // 기분 색상 업데이트 함수
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

/**
 * HabitContext의 값을 사용하는 커스텀 Hook입니다.
 * @returns {object} HabitContext에서 제공하는 값 (entries, addEntry, updateEntry, deleteEntry)
 */
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
