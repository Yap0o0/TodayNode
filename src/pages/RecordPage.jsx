import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import MusicRecommender from '../components/MusicRecommender';

/**
 * 기분 기록 페이지 컴포넌트입니다.
 * 사용자의 기분과 태그를 기록하고 음악을 추천받는 기능을 제공합니다.
 */
const RecordPage = () => {
  const [isRecording, setIsRecording] = useState(false); // 기록 시작 여부
  const [selectedMood, setSelectedMood] = useState(null); // 선택된 기분
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 배열
  const [memoContent, setMemoContent] = useState(''); // 메모 내용

  const handleSelectMood = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleAddTag = (tag) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
  };

  const handleSave = () => {
    // TODO: 여기에 저장 로직 (LocalStorage 등) 구현
    console.log('기록 저장:', { selectedMood, selectedTags, memoContent });
    setIsRecording(false); // 저장 후 초기 화면으로 돌아감
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
  };

  const handleCancel = () => {
    setIsRecording(false); // 취소 후 초기 화면으로 돌아감
    setSelectedMood(null);
    setSelectedTags([]);
    setMemoContent('');
  };

  return (
    <div className="record-page p-4 bg-white rounded-lg shadow-md">
      {!isRecording ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
          <Sparkles size={48} className="text-yellow-400 mb-4" />
          <p className="text-lg mb-6">오늘의 기분을 기록해보세요</p>
          <button
            onClick={() => setIsRecording(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            기록 시작하기
          </button>
        </div>
      ) : (
        // Recording State
        <div className="recording-form">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">새로운 기록</h2>

          <MoodSelector selectedMood={selectedMood} onSelectMood={handleSelectMood} />

          <TagSelector
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onAddTag={handleAddTag}
          />

          <div className="memo-section mb-6">
            <h3 className="text-xl font-semibold mb-3">메모 (선택)</h3>
            <textarea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              placeholder="오늘의 순간을 기록해보세요..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            ></textarea>
          </div>

          <MusicRecommender />

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordPage;
