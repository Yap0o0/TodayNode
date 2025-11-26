import React from 'react';

/**
 * 사용자의 기분을 선택하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string} props.selectedMood - 현재 선택된 기분
 * @param {function} props.onSelectMood - 기분 선택 시 호출될 함수
 */
const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const moods = [
    { id: 'happy', label: '행복', emoji: '😊' },
    { id: 'excited', label: '신남', emoji: '🥳' },
    { id: 'calm', label: '편안', emoji: '😌' },
    { id: 'soso', label: '그저', emoji: '😐' },
    { id: 'depressed', label: '우울', emoji: '😔' },
    { id: 'angry', label: '화남', emoji: '😡' },
    { id: 'etc', label: '기타', emoji: '💡' }, // '기타'는 이모지 선택 모달로 이어질 수 있음
  ];

  return (
    <div className="mood-selector mb-6">
      <h3 className="text-xl font-semibold mb-3">오늘의 기분</h3>
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelectMood(mood.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
              ${selectedMood === mood.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-100'}
            `}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
