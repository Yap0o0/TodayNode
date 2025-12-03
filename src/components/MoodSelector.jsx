import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/styleUtils';
import EmojiPicker from 'emoji-picker-react';

/**
 * 사용자의 기분을 선택하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string | null} props.selectedMood - 현재 선택된 기분 ID
 * @param {(moodId: string) => void} props.onSelectMood - 기분 선택 시 호출될 함수
 * @param {string | null} props.customEmoji - 기타 기분용 커스텀 이모지
 * @param {(emoji: string) => void} props.onCustomEmojiChange - 커스텀 이모지 변경 시 호출될 함수
 */
const MoodSelector = ({ selectedMood, onSelectMood, customEmoji, onCustomEmojiChange }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);

  const moods = [
    { id: 'happy', label: '행복', emoji: '😊' },
    { id: 'excited', label: '신남', emoji: '🥳' },
    { id: 'calm', label: '편안', emoji: '😌' },
    { id: 'soso', label: '그저', emoji: '😐' },
    { id: 'depressed', label: '우울', emoji: '😔' },
    { id: 'angry', label: '화남', emoji: '😡' },
    { id: 'etc', label: '기타', emoji: customEmoji || '❓' },
  ];

  // 이모지 피커 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (e, moodId) => {
    if (moodId === 'etc') {
      e.stopPropagation(); // 부모의 onClick 이벤트 전파 방지
      setShowEmojiPicker(!showEmojiPicker);
      onSelectMood('etc'); // 이모지 클릭 시에도 '기타' 선택
    }
  };

  const onEmojiClick = (emojiData) => {
    onCustomEmojiChange(emojiData.emoji);
    setShowEmojiPicker(false);
    onSelectMood('etc'); // 이모지 선택 시 '기타' 선택
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {moods.map((mood) => (
          <div
            key={mood.id}
            role="button"
            tabIndex="0"
            onClick={() => {
              onSelectMood(mood.id);
              if (mood.id === 'etc') {
                setShowEmojiPicker(!showEmojiPicker);
              } else {
                setShowEmojiPicker(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectMood(mood.id);
                if (mood.id === 'etc') {
                  setShowEmojiPicker(!showEmojiPicker);
                } else {
                  setShowEmojiPicker(false);
                }
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
            <span
              className={cn("mb-1 text-3xl", mood.id === 'etc' ? "cursor-pointer hover:scale-110 transition-transform" : "pointer-events-none")}
            >
              {mood.emoji}
            </span>
            <span className="pointer-events-none text-xs font-medium">{mood.label}</span>
          </div>
        ))}
      </div>

      {showEmojiPicker && (
        <div className="absolute top-full right-0 mt-2 z-50 shadow-xl" ref={pickerRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
