import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Calendar, Book, BarChart2 } from 'lucide-react';

/**
 * 탭 네비게이션을 담당하는 컴포넌트입니다.
 */
const TabNav = () => {
  const location = useLocation();

  const tabs = [
    { name: '기록', path: '/record', icon: <Plus size={20} /> },
    { name: '캘린더', path: '/calendar', icon: <Calendar size={20} /> },
    { name: '일기', path: '/diary', icon: <Book size={20} /> },
    { name: '분석', path: '/analysis', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center justify-around">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 ${
            location.pathname === tab.path
              ? 'bg-purple-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.icon}
          <span className="font-medium">{tab.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default TabNav;
