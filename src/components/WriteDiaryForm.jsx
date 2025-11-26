import React, { useState, useEffect } from 'react';
import MoodSelector from './MoodSelector'; // MoodSelector 재사용

/**
 * 일기 작성 및 편집 폼 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {object} [props.initialData] - 편집 모드일 때 초기 데이터
 * @param {function} props.onSave - 저장 버튼 클릭 시 호출될 함수
 * @param {function} props.onCancel - 취소 버튼 클릭 시 호출될 함수
 */
const WriteDiaryForm = ({ initialData, onSave, onCancel }) => {
  const [selectedMood, setSelectedMood] = useState(initialData?.moodId || null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  // 편집 모드 진입 시 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setSelectedMood(initialData.moodId || null);
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 간단한 유효성 검사
    if (!selectedMood || !title.trim() || !content.trim()) {
      alert('기분, 제목, 내용을 모두 입력해주세요.');
      return;
    }
    // 현재 시간 추가 (임시)
    const now = new Date();
    const date = now.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '').trim().replace(/ /g, '-');
    const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // moodId에 해당하는 emoji를 MoodSelector에서 가져와야 하지만,
    // 현재는 직접 매핑 (추후 MoodSelector의 moods 배열을 활용하도록 개선 필요)
    const moodEmojis = {
      happy: '😊', excited: '🥳', calm: '😌', soso: '😐', depressed: '😔', angry: '😡', etc: '💡'
    };
    const moodEmoji = moodEmojis[selectedMood] || '😐'; // 기본값

    onSave({
      moodId: selectedMood,
      moodEmoji,
      title: title.trim(),
      content: content.trim(),
      date,
      time,
      mood: selectedMood, // 기분 id를 mood로 사용 (추후 한글 이름으로 변경 가능)
    });
  };

  return (
    <div className="write-diary-form p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

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
