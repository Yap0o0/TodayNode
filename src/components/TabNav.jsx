import React from 'react';
import { Plus, Calendar, Book, BarChart2 } from 'lucide-react';

/**
 * 탭 네비게이션을 담당하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {string} props.activeTab - 현재 활성화된 탭
 * @param {function} props.setActiveTab - 탭 변경 핸들러
 */
const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: '기록', id: 'record', icon: <Plus size={20} /> },
    { name: '캘린더', id: 'calendar', icon: <Calendar size={20} /> },
    { name: '일기', id: 'diary', icon: <Book size={20} /> },
    { name: '분석', id: 'analysis', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center justify-around">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 ${
            activeTab === tab.id
              ? 'bg-purple-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.icon}
          <span className="font-medium">{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNav;
