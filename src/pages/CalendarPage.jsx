import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../components/Calendar.css'; // Import custom calendar styles
import { Edit, Trash2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext'; // useHabits import

/**
 * 캘린더 페이지 컴포넌트입니다.
 * 날짜별 기록을 캘린더와 리스트 형태로 보여줍니다.
 */
const CalendarPage = () => {
  const { entries, deleteEntry } = useHabits(); // entries와 deleteEntry 함수 가져오기
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleEditEntry = (id) => {
    // TODO: 일기 편집 기능 구현 (새로운 페이지로 이동 또는 모달 열기)
    alert(`일기 #${id} 편집 기능은 아직 구현되지 않았습니다.`);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      deleteEntry(id);
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
                  <button onClick={() => handleEditEntry(record.id)} className="text-gray-500 hover:text-blue-500">
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
    </div>
  );
};

export default CalendarPage;