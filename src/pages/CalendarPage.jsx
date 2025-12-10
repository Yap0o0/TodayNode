import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../components/Calendar.css'; // Import custom calendar styles
import { Edit, Trash2, Share2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext'; // useHabits import
import Modal from '../components/Modal';
import MoodSelector from '../components/MoodSelector';
import TagSelector from '../components/TagSelector';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import ShareModal from '../components/ShareModal';

/**
 * 캘린더 페이지 컴포넌트입니다.
 * 날짜별 기록을 캘린더와 리스트 형태로 보여줍니다.
 */
const CalendarPage = () => {
  const { entries, deleteEntry, updateEntry, moodColors } = useHabits(); // moodColors는 fallback용으로 유지
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 수정 모달 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editMood, setEditMood] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [editContent, setEditContent] = useState('');
  const [editThemeColor, setEditThemeColor] = useState('#FCD34D'); // 테마 색상 수정 상태
  const [showColorPicker, setShowColorPicker] = useState(false); // 색상 피커 표시 여부

  // 삭제 모달 관련 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState(null);

  // 공유 모달 관련 상태
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingEntry, setSharingEntry] = useState(null);

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
    setEditThemeColor(entry.themeColor || '#FCD34D'); // 기존 테마 색상 로드
    setIsEditing(true);
  };

  const handleDeleteRecord = (id) => {
    setDeletingEntryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleShareRecord = (entry) => {
    setSharingEntry(entry);
    setIsShareModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingEntryId) {
      deleteEntry(deletingEntryId);
      setIsDeleteModalOpen(false);
      setDeletingEntryId(null);
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
      themeColor: editThemeColor, // 수정된 테마 색상 저장
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
    <div className="calendar-page p-4 relative">
      <div className="flex flex-col md:flex-row md:gap-8 h-full">
        {/* 왼쪽: 캘린더 */}
        <div className="mb-6 md:mb-0 md:w-1/2 lg:w-[450px] md:shrink-0">
          <div className="p-5 bg-white/70 backdrop-blur-md rounded-[30px] shadow-md border-2 border-white/80 sticky top-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              formatDay={(locale, date) => date.getDate()} // 날짜(일)만 표시
              tileClassName={({ date, view }) => {
                // 날짜에 기록이 있는지 확인하여 클래스 추가 (텍스트 색상 변경용 - 이번엔 필요 없을 수 있지만 유지)
                if (view === 'month') {
                  const hasRecord = entries.some(entry => {
                    const entryDate = new Date(entry.timestamp);
                    return formatDate(entryDate) === formatDate(date);
                  });
                  if (hasRecord) return 'has-mood-record';
                }
                return null;
              }}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const recordsOnDay = entries.filter(entry => {
                    const entryDate = new Date(entry.timestamp);
                    return formatDate(entryDate) === formatDate(date);
                  });

                  if (recordsOnDay.length > 0) {
                    // 가장 많이 등장한 기분 찾기 (빈도수 계산)
                    const moodCounts = recordsOnDay.reduce((acc, record) => {
                      const moodId = record.moodId || 'etc';
                      acc[moodId] = (acc[moodId] || 0) + 1;
                      return acc;
                    }, {});

                    let maxCount = 0;
                    let mostFrequentMoodId = 'etc';

                    Object.entries(moodCounts).forEach(([moodId, count]) => {
                      if (count > maxCount) {
                        maxCount = count;
                        mostFrequentMoodId = moodId;
                      }
                    });

                    // 해당 기분의 색상 가져오기 (없으면 기본값)
                    // 우선순위: 1. 첫 번째 기록의 themeColor 2. 가장 빈도 높은 기분의 색상
                    const firstRecord = recordsOnDay[0];
                    const moodColor = firstRecord.themeColor || moodColors[mostFrequentMoodId] || '#A78BFA';

                    return (
                      <>
                        {/* 동적 색상 테두리 (테마 적용 - 테두리만) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: '2px',
                            right: '2px',
                            bottom: '2px',
                            border: `3px solid ${moodColor}`, // 두께 조절 가능
                            backgroundColor: 'white', // 내부는 흰색
                            borderRadius: '12px', // 둥근 모서리
                            zIndex: 0
                          }}
                        />
                        {/* 이모지 표시 */}
                        <span className="day-emoji" style={{ position: 'relative', zIndex: 1 }}>{recordsOnDay[0].moodEmoji}</span>
                      </>
                    );
                  }
                }
                return null;
              }}
            />
          </div>
        </div>

        {/* 오른쪽: 기록 리스트 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-3 text-[var(--text-main)] pl-2 border-l-4 border-[var(--color-cloud-pink)]">
            {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}의 기록
          </h3>
          {recordsForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {recordsForSelectedDate.map((record, index) => {
                const colors = ['card-pink', 'card-beige', 'card-yellow', 'card-mint'];
                const colorClass = colors[index % colors.length];
                return (
                  <div key={record.id} className={`p-5 rounded-[20px] shadow-sm flex items-start justify-between ${colorClass}`}>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{record.moodEmoji}</span>
                        <span className="font-bold text-lg text-[var(--text-main)]">{record.mood}</span>
                        <span className="text-sm text-[var(--text-sub)] ml-3">
                          {new Date(record.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {record.tags && record.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white/50 text-[var(--text-main)] rounded-full text-xs border border-white/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {record.content && (
                        <p className="text-[var(--text-main)] mt-2 line-clamp-2">{record.content}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button onClick={() => handleShareRecord(record)} className="text-gray-400 hover:text-green-500" title="공유하기">
                        <Share2 size={20} />
                      </button>
                      <button onClick={() => handleEditEntry(record)} className="text-gray-400 hover:text-blue-500" title="수정하기">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDeleteRecord(record.id)} className="text-gray-400 hover:text-red-500" title="삭제하기">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-6 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500">이 날짜에는 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 수정 모달 */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="기록 수정"
      >
        <div className="space-y-6">
          {/* 테마 색상 수정 영역 추가 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">테마 색상</h3>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 rounded-full bg-white shadow-sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: editThemeColor }} />
                  색상 변경
                </Button>
                {showColorPicker && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 grid grid-cols-4 gap-2 w-48">
                    {['#FCD34D', '#F87171', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#9CA3AF', '#FBBF24'].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setEditThemeColor(color);
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={editThemeColor}
                      onChange={(e) => setEditThemeColor(e.target.value)}
                      className="w-8 h-8 rounded-full p-0 border-none cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

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

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="기록 삭제"
      >
        <div className="space-y-4">
          <p className="text-gray-600">정말로 이 기록을 삭제하시겠습니까?</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">삭제</Button>
          </div>
        </div>
      </Modal>

      {/* 공유 모달 추가 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        entry={sharingEntry}
      />
    </div>
  );
};

export default CalendarPage;