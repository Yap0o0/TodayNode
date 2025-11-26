import React, { useState } from 'react';
import { PencilLine, Edit, Trash2 } from 'lucide-react';
import WriteDiaryForm from '../components/WriteDiaryForm'; // WriteDiaryForm import

/**
 * 일기 페이지 컴포넌트입니다.
 * 일기 목록을 보여주거나 새 일기를 작성/편집하는 기능을 제공합니다.
 */
const DiaryPage = () => {
  const [isWriting, setIsWriting] = useState(false); // 일기 작성/편집 모드 여부
  const [editingEntryId, setEditingEntryId] = useState(null); // 편집 중인 일기 ID
  
  // 임시 목업 데이터
  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 'diary-1',
      moodId: 'happy',
      moodEmoji: '😊',
      title: '행복했던 하루',
      date: '2025-11-23',
      time: '21:40',
      mood: '행복',
      content: '오랜만에 친구와 만나 즐거운 시간을 보냈다. 맛있는 저녁도 먹고 영화도 봐서 기분이 좋다.',
    },
    // 다른 일기 엔트리들을 추가할 수 있습니다.
  ]);

  const handleStartWriting = () => {
    setIsWriting(true);
    setEditingEntryId(null);
  };

  const handleEditEntry = (id) => {
    const entryToEdit = diaryEntries.find(entry => entry.id === id);
    if (entryToEdit) {
      setEditingEntryId(id);
      setIsWriting(true);
    }
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      setDiaryEntries(diaryEntries.filter(entry => entry.id !== id));
    }
  };

  const handleSaveDiary = (newEntryData) => {
    if (editingEntryId) {
      // 기존 일기 업데이트
      setDiaryEntries(diaryEntries.map(entry => 
        entry.id === editingEntryId ? { ...newEntryData, id: editingEntryId } : entry
      ));
    } else {
      // 새 일기 추가
      setDiaryEntries([...diaryEntries, { ...newEntryData, id: `diary-${Date.now()}` }]);
    }
    setIsWriting(false);
    setEditingEntryId(null);
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
    setEditingEntryId(null);
  };

  if (isWriting) {
    const initialData = editingEntryId ? diaryEntries.find(entry => entry.id === editingEntryId) : null;
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
        <button
          onClick={handleStartWriting}
          className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-purple-600 transition-colors flex items-center"
        >
          <PencilLine size={18} className="mr-2" /> 일기 쓰기
        </button>
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
          {diaryEntries.map(entry => (
            <div key={entry.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{entry.moodEmoji}</span>
                  <span className="font-bold text-lg text-gray-700">{entry.title}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {entry.date} {entry.time} • {entry.mood}
                </p>
                <p className="text-gray-600 line-clamp-1">{entry.content}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEditEntry(entry.id)} className="text-gray-500 hover:text-blue-500">
                  <Edit size={20} />
                </button>
                <button onClick={() => handleDeleteEntry(entry.id)} className="text-gray-500 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
