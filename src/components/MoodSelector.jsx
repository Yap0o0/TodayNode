import React from 'react';
import { cn } from '../utils/styleUtils';

/**
 * 사용자의 기분을 선택하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string | null} props.selectedMood - 현재 선택된 기분 ID
 * @param {(moodId: string) => void} props.onSelectMood - 기분 선택 시 호출될 함수
 */
const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const moods = [
    { id: 'happy', label: '행복', emoji: '😊' },
    { id: 'excited', label: '신남', emoji: '🥳' },
    { id: 'calm', label: '편안', emoji: '😌' },
    { id: 'soso', label: '그저', emoji: '😐' },
    { id: 'depressed', label: '우울', emoji: '😔' },
    { id: 'angry', label: '화남', emoji: '😡' },
    // { id: 'etc', label: '기타', emoji: '💡' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {moods.map((mood) => (
        <div
          key={mood.id}
          role="button"
          tabIndex="0"
          onClick={() => onSelectMood(mood.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectMood(mood.id);
            }
          }}
          className={cn(
            'relative z-10 flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-colors duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            selectedMood === mood.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 bg-transparent text-gray-600'
          )}
        >
          <span className="pointer-events-none mb-1 text-3xl">{mood.emoji}</span>
          <span className="pointer-events-none text-xs font-medium">{mood.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MoodSelector;
