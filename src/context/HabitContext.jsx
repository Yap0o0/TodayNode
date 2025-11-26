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

  // Context를 통해 제공할 값
  const value = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
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
