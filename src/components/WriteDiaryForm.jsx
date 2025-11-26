import React, { useState, useEffect } from 'react';
import MoodSelector from './MoodSelector'; // MoodSelector 재사용

// 컴포넌트 외부 또는 별도의 constants 파일로 분리하는 것을 권장합니다.
const moods = [
  { id: 'happy', label: '행복', emoji: '😊' },
  { id: 'excited', label: '신남', emoji: '🥳' },
  { id: 'calm', label: '편안', emoji: '😌' },
  { id: 'soso', label: '그저', emoji: '😐' },
  { id: 'depressed', label: '우울', emoji: '😔' },
  { id: 'angry', label: '화남', emoji: '😡' },
  { id: 'etc', label: '기타', emoji: '💡' },
];

const getMoodIdFromLabel = (label) => {
  const mood = moods.find(m => m.label === label);
  return mood ? mood.id : null;
};


/**
 * 일기 작성 및 편집 폼 컴포넌트입니다.
 */
const WriteDiaryForm = ({ initialData, onSave, onCancel }) => {
  const getInitialMoodId = () => {
    if (!initialData) return null;
    if (initialData.moodId) return initialData.moodId;
    return getMoodIdFromLabel(initialData.mood);
  };

  const [selectedMood, setSelectedMood] = useState(getInitialMoodId);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  useEffect(() => {
    setSelectedMood(getInitialMoodId());
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood || !title.trim() || !content.trim()) {
      alert('기분, 제목, 내용을 모두 입력해주세요.');
      return;
    }
    
    const selectedMoodObject = moods.find(m => m.id === selectedMood) || moods.find(m => m.id === 'soso');

    onSave({
      moodId: selectedMoodObject.id,
      mood: selectedMoodObject.label,
      moodEmoji: selectedMoodObject.emoji,
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="write-diary-form p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-3">오늘의 기분</label>
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-xl font-semibold mb-2">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일기 제목을 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-xl font-semibold mb-2">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 하루를 기록해보세요..."
            rows="8"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteDiaryForm;
