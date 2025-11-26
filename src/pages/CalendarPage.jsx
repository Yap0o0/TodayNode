import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../components/Calendar.css'; // Import custom calendar styles
import { Edit, Trash2 } from 'lucide-react';

/**
 * 캘린더 페이지 컴포넌트입니다.
 * 날짜별 기록을 캘린더와 리스트 형태로 보여줍니다.
 */
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 임시 목업 데이터
  const mockRecords = {
    "2025-11-23": [
      {
        id: 'rec1',
        time: '21:40',
        mood: '우울',
        moodEmoji: '😔',
        tags: ['#공부'],
      },
    ],
    "2025-11-15": [
      {
        id: 'rec2',
        time: '13:20',
        mood: '행복',
        moodEmoji: '😊',
        tags: ['#친구', '#커피'],
      },
    ]
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const recordsForSelectedDate = mockRecords[formatDate(selectedDate)] || [];

  return (
    <div className="calendar-page p-4">
      <div className="mb-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          formatDay={(locale, date) => date.getDate()} // 날짜(일)만 표시
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const record = mockRecords[formatDate(date)];
              if (record) {
                return <span className="day-emoji">{record[0].moodEmoji}</span>;
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
                    <span className="text-sm text-gray-500 ml-3">{record.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="text-gray-500 hover:text-blue-500">
                    <Edit size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
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