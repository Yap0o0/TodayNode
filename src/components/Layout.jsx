import React, { useState } from 'react';
import { Settings, Bell, Home, Calendar, Book, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import TabNav from './TabNav';
import SettingsModal from './SettingsModal';

/**
 * 앱의 메인 레이아웃을 정의하는 컴포넌트입니다.
 * 헤더, 메인 콘텐츠 영역, 그리고 하단 탭 네비게이션으로 구성됩니다.
 * 배경에 구름 효과와 종이 질감이 적용됩니다.
 * 반응형 디자인: Mobile(Bottom Tab), PC(Sidebar)
 */
const Layout = ({ children }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const location = useLocation();

  const handleNotificationClick = () => {
    setIsSettingsModalOpen(true);
  };

  const tabs = [
    { name: '홈', path: '/record', icon: <Home size={24} />, colorClass: 'text-[var(--color-cloud-pink)]' },
    { name: '캘린더', path: '/calendar', icon: <Calendar size={24} />, colorClass: 'text-[var(--color-cloud-blue)]' },
    { name: '일기', path: '/diary', icon: <Book size={24} />, colorClass: 'text-[var(--color-cloud-purple)]' },
    { name: '분석', path: '/analysis', icon: <BarChart2 size={24} />, colorClass: 'text-[var(--color-cloud-mint)]' },
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center bg-[var(--bg-paper)]">
      {/* Cloud Effects */}
      <div className="fixed top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-[var(--color-cloud-pink)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-60px] w-[180px] h-[180px] rounded-full bg-[var(--color-cloud-blue)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed bottom-[50px] left-[-40px] w-[160px] h-[160px] rounded-full bg-[var(--color-cloud-purple)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed bottom-[-50px] right-[-30px] w-[190px] h-[190px] rounded-full bg-[var(--color-cloud-pink)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>

      {/* Main Container (Responsive) */}
      <div className="w-full h-full flex flex-col md:flex-row md:max-w-6xl md:h-[90vh] md:bg-white/40 md:backdrop-blur-xl md:rounded-3xl md:shadow-2xl md:overflow-hidden relative transition-all duration-300">

        {/* PC Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-white/60 border-r border-gray-100 p-6 backdrop-blur-md">
          <div className="mb-10 px-2">
            <h1 className="text-3xl font-bold text-[var(--text-main)] drop-shadow-sm font-['Gamja_Flower']">하루 노드</h1>
            <p className="text-sm text-gray-500 mt-1">오늘의 감정을 기록하세요</p>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-white shadow-sm text-gray-800 font-bold'
                      : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                    }`}
                >
                  <div className={`${isActive ? tab.colorClass : 'text-gray-400'}`}>
                    {tab.icon}
                  </div>
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 p-3 text-sm text-gray-600 hover:bg-white/80 rounded-xl transition-colors"
            >
              <Settings size={20} />
              <span>설정</span>
            </button>
          </div>
        </aside>

        {/* Mobile Container Wrappers */}
        <div className="flex-1 flex flex-col relative w-full h-full md:bg-transparent overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden pt-8 pb-4 px-4 text-center z-20 relative flex items-center justify-center shrink-0">
            <h1 className="text-2xl font-bold text-[var(--text-main)] drop-shadow-sm">하루 노드</h1>
            <div className="absolute right-4 top-8 flex gap-2">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-600"
                title="알림"
              >
                <Bell size={24} />
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-gray-600"
                title="설정"
              >
                <Settings size={24} />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-4 md:p-8 overflow-y-auto scrollbar-hide pb-32 md:pb-8 w-full max-w-[480px] md:max-w-none mx-auto">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <footer className="md:hidden fixed bottom-0 w-full max-w-[480px] z-50 self-center">
            <TabNav />
          </footer>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
