import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Book, BarChart2 } from 'lucide-react';

/**
 * 탭 네비게이션을 담당하는 컴포넌트입니다.
 * 새로운 디자인(Glassmorphism)이 적용되었습니다.
 */
const TabNav = () => {
  const location = useLocation();

  const tabs = [
    { name: '홈', path: '/record', icon: <Home size={24} />, colorClass: 'stroke-[var(--color-cloud-pink)]' },
    { name: '캘린더', path: '/calendar', icon: <Calendar size={24} />, colorClass: 'stroke-[var(--color-cloud-blue)]' },
    { name: '일기', path: '/diary', icon: <Book size={24} />, colorClass: 'stroke-[var(--color-cloud-purple)]' },
    { name: '분석', path: '/analysis', icon: <BarChart2 size={24} />, colorClass: 'stroke-[var(--color-cloud-mint)]' },
  ];

  return (
    <div className="h-[70px] bg-white/95 backdrop-blur-md flex justify-around items-center border-t border-gray-100 rounded-b-[35px] pb-2">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center flex-1 h-full text-[0.85rem] transition-colors duration-300 no-underline ${isActive ? 'text-[var(--text-main)] font-bold' : 'text-gray-400'
              }`}
          >
            <div
              className={`transition-all duration-300 ${isActive ? 'transform -translate-y-1 drop-shadow-md' : ''
                }`}
              style={{
                stroke: isActive ? undefined : '#999', // Inactive color
              }}
            >
              {/* Clone element to apply specific stroke color when active */}
              {React.cloneElement(tab.icon, {
                className: `w-[26px] h-[26px] stroke-2 ${isActive ? tab.colorClass : 'stroke-gray-400'}`,
              })}
            </div>
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default TabNav;
