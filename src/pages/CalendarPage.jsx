import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../components/Calendar.css'; // Import custom calendar styles
import { Edit, Trash2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext'; // useHabits import
import Modal from '../components/Modal';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';

/**
 * 캘린더 페이지 컴포넌트입니다.
 * 날짜별 기록을 캘린더와 리스트 형태로 보여줍니다.
 */
const CalendarPage = () => {
  const { entries, deleteEntry, updateEntry } = useHabits(); // updateEntry 추가
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 수정 모달 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editMood, setEditMood] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [editContent, setEditContent] = useState('');

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const recordsForSelectedDate = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return formatDate(entryDate) === formatDate(selectedDate);
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // 시간 순으로 정렬

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditMood(entry.moodId || null); // moodId가 없으면 null (기존 데이터 호환성)
    setEditTags(entry.tags || []);
    setEditContent(entry.content || '');
    setIsEditing(true);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      deleteEntry(id);
    }
  };

  const handleSaveEdit = () => {
    if (!editMood) {
      alert('기분을 선택해주세요.');
      return;
    }

    const moodMap = {
      happy: { label: '행복', emoji: '😊' },
      excited: { label: '신남', emoji: '🥳' },
      calm: { label: '편안', emoji: '😌' },
      soso: { label: '그저', emoji: '😐' },
      depressed: { label: '우울', emoji: '😔' },
      angry: { label: '화남', emoji: '😡' },
      etc: { label: '기타', emoji: '💡' },
    };
    const currentMood = moodMap[editMood] || { label: '알 수 없음', emoji: '❓' };

    updateEntry(editingEntry.id, {
      moodId: editMood,
      mood: currentMood.label,
      moodEmoji: currentMood.emoji,
      tags: editTags,
      content: editContent,
    });

    setIsEditing(false);
    setEditingEntry(null);
  };

  const handleToggleTag = (tag) => {
    setEditTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleAddTag = (tag) => {
    if (tag && !editTags.includes(tag)) {
      setEditTags((prevTags) => [...prevTags, tag]);
    }
  };

  return (
    <div className="calendar-page p-4">
      <div className="mb-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          formatDay={(locale, date) => date.getDate()} // 날짜(일)만 표시
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const recordsOnDay = entries.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                return formatDate(entryDate) === formatDate(date);
              });
              if (recordsOnDay.length > 0) {
                // 해당 날짜의 첫 번째 기록의 이모지를 표시
                return <span className="day-emoji">{recordsOnDay[0].moodEmoji}</span>;
              }
            }
            return null;
          }}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">
          {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}의 기록
        </h3>
        {recordsForSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {recordsForSelectedDate.map(record => (
              <div key={record.id} className="p-4 bg-white rounded-lg shadow-md flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{record.moodEmoji}</span>
                    <span className="font-bold text-lg text-gray-700">{record.mood}</span>
                    <span className="text-sm text-gray-500 ml-3">
                      {new Date(record.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.tags && record.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {record.content && (
                    <p className="text-gray-600 mt-2 line-clamp-2">{record.content}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEditEntry(record)} className="text-gray-500 hover:text-blue-500">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDeleteRecord(record.id)} className="text-gray-500 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">이 날짜에는 기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 수정 모달 */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="기록 수정"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">오늘의 기분</h3>
            <MoodSelector selectedMood={editMood} onSelectMood={setEditMood} />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">태그</h3>
            <TagSelector
              selectedTags={editTags}
              onToggleTag={handleToggleTag}
              onAddTag={handleAddTag}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">메모</h3>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              rows="4"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>취소</Button>
            <Button onClick={handleSaveEdit}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;