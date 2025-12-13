import React, { useState } from 'react';
import { PencilLine, Edit, Trash2, Sparkles, Download } from 'lucide-react';
import WriteDiaryForm from '../components/WriteDiaryForm';
import ShareModal from '../components/ShareModal';
import { useHabits } from '../context/HabitContext'; // useHabits import

/**
 * 일기 페이지 컴포넌트입니다.
 * 일기 목록을 보여주거나 새 일기를 작성/편집하는 기능을 제공합니다.
 */
const DiaryPage = () => {
  const { entries, addEntry, updateEntry, deleteEntry } = useHabits(); // HabitContext에서 데이터와 함수 가져오기
  const [isWriting, setIsWriting] = useState(false); // 일기 작성/편집 모드 여부
  const [editingEntryId, setEditingEntryId] = useState(null); // 편집 중인 일기 ID
  const [shareModalEntry, setShareModalEntry] = useState(null); // 공유할 일기 데이터

  // content 필드가 있고, type이 'diary'인 엔트리만 일기(Diary)로 간주합니다.
  // 기존 데이터(type 필드가 없는 경우)는 content가 있으면 일기로 간주할 수도 있지만, 
  // 명확한 분리를 위해 type 체크를 우선합니다. (마이그레이션 이슈 방지 위해 type이 없으면 제외하거나 포함 정책 결정 필요)
  // 여기서는 type === 'diary'만 보여주도록 엄격하게 필터링합니다.
  const diaryEntries = entries.filter(entry => entry.type === 'diary');

  const handleStartWriting = () => {
    setIsWriting(true);
    setEditingEntryId(null);
  };

  const handleEditEntry = (id) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit) {
      setEditingEntryId(id);
      setIsWriting(true);
    }
  };

  const handleDeleteDiary = (id) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      deleteEntry(id); // Context의 deleteEntry 사용
    }
  };

  const handleShareEntry = (entry) => {
    setShareModalEntry(entry);
  };

  const handleSaveDiary = (newEntryData) => {
    // newEntryData에는 moodId, moodEmoji, title, content, date, time, mood가 포함
    if (editingEntryId) {
      // 기존 일기 업데이트
      updateEntry(editingEntryId, {
        mood: newEntryData.mood,
        moodEmoji: newEntryData.moodEmoji,
        content: newEntryData.content,
        title: newEntryData.title,
        // tags는 일기에서는 필수가 아니므로 업데이트 시점에만 포함하지 않음
        // timestamp는 HabitContext에서 관리
      });
    } else {
      // 새 일기 추가
      addEntry({
        type: 'diary', // 데이터 타입 구분: 일기
        mood: newEntryData.mood,
        moodEmoji: newEntryData.moodEmoji,
        content: newEntryData.content,
        title: newEntryData.title,
        // tags는 일기에서는 필수가 아니므로 빈 배열 또는 기본값 설정 (PRD 스키마에 따라)
        tags: [], // 일기에서는 태그가 필수가 아니므로 비워둠
      });
    }
    setIsWriting(false);
    setEditingEntryId(null);
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
    setEditingEntryId(null);
  };

  if (isWriting) {
    const initialData = editingEntryId ? entries.find(entry => entry.id === editingEntryId) : null;
    return (
      <WriteDiaryForm
        initialData={initialData}
        onSave={handleSaveDiary}
        onCancel={handleCancelWriting}
      />
    );
  }

  return (
    <div className="diary-page p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">일기장</h2>
        <div className="flex gap-2">
          <button
            onClick={handleStartWriting}
            className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-purple-600 transition-all hover:scale-105 active:scale-95 flex items-center"
          >
            <PencilLine size={18} className="mr-2" /> 일기 쓰기
          </button>
        </div>
      </div>

      {diaryEntries.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500 bg-white rounded-lg shadow-md p-6">
          <PencilLine size={48} className="text-gray-400 mb-4" />
          <p className="text-lg mb-2">아직 작성한 일기가 없습니다.</p>
          <p className="text-md">오늘 하루를 기록해보세요!</p>
        </div>
      ) : (
        // Populated State
        <div className="space-y-4">
          {diaryEntries.map((entry, index) => {
            // Cycle through pastel colors
            const colors = ['card-pink', 'card-beige', 'card-yellow', 'card-mint'];
            const colorClass = colors[index % colors.length];
            // Add slight rotation for "sticky note" effect
            const rotation = (index % 2 === 0 ? -1 : 1) * (Math.random() * 1.5);

            return (
              <div key={entry.id} className="mb-4 transition-transform duration-300 hover:z-10" style={{ transform: `rotate(${rotation}deg)` }}>
                <div className={`p-5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-md flex justify-between items-center transition-transform duration-300 hover:scale-[1.03] ${colorClass}`} style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{entry.moodEmoji}</span>
                      <span className="font-bold text-lg text-[var(--text-main)]">{entry.title}</span>
                    </div>
                    <p className="text-sm text-[var(--text-sub)] mb-2">
                      {new Date(entry.timestamp).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} • {entry.mood}
                    </p>
                    <p className="text-[var(--text-main)] line-clamp-1 break-all">{entry.content}</p>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button onClick={() => handleShareEntry(entry)} className="text-gray-400 hover:text-pink-500 transition-all hover:scale-110 active:scale-95" title="이미지 저장">
                      <Download size={20} />
                    </button>

                    <button onClick={() => handleEditEntry(entry.id)} className="text-gray-400 hover:text-blue-500 transition-all hover:scale-110 active:scale-95" title="수정">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDeleteDiary(entry.id)} className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95" title="삭제">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 공유 모달 */}
      <ShareModal
        isOpen={!!shareModalEntry}
        onClose={() => setShareModalEntry(null)}
        entry={shareModalEntry}
      />
    </div>
  );
};

export default DiaryPage;
