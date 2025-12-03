import React, { useState } from 'react';
import { Settings, Bell } from 'lucide-react';
import TabNav from './TabNav';
import SettingsModal from './SettingsModal';

/**
 * 앱의 메인 레이아웃을 정의하는 컴포넌트입니다.
 * 헤더, 메인 콘텐츠 영역, 그리고 하단 탭 네비게이션으로 구성됩니다.
 * 배경에 구름 효과와 종이 질감이 적용됩니다.
 */
const Layout = ({ children }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleNotificationClick = () => {
    // 알림 버튼 클릭 시 설정 모달의 알림 섹션을 보여주거나, 
    // 간단히 권한 요청을 수행할 수 있습니다. 
    // 여기서는 설정 모달을 열도록 유도하거나, 직접 권한 요청을 할 수도 있습니다.
    // 사용자 경험상 설정 모달을 여는 것이 통합된 경험을 제공하므로 설정 모달을 엽니다.
    setIsSettingsModalOpen(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center bg-[var(--bg-paper)]">
      {/* Cloud Effects */}
      <div className="fixed top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-[var(--color-cloud-pink)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-60px] w-[180px] h-[180px] rounded-full bg-[var(--color-cloud-blue)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed bottom-[50px] left-[-40px] w-[160px] h-[160px] rounded-full bg-[var(--color-cloud-purple)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="fixed bottom-[-50px] right-[-30px] w-[190px] h-[190px] rounded-full bg-[var(--color-cloud-pink)] blur-[50px] opacity-40 -z-10 mix-blend-multiply pointer-events-none"></div>

      {/* Main Container (Mobile Frame) */}
      <div className="w-full max-w-[480px] h-full flex flex-col relative bg-transparent">

        {/* Header */}
        <header className="pt-8 pb-4 px-4 text-center z-20 relative flex items-center justify-center">
          <h1 className="text-2xl font-bold text-[var(--text-main)] drop-shadow-sm">하루 노드</h1>

          {/* Header Buttons */}
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
        <main className="flex-grow p-5 overflow-y-auto scrollbar-hide pb-32">
          {children}
        </main>

        {/* Bottom Navigation */}
        <footer className="fixed bottom-0 w-full max-w-[480px] z-50">
          <TabNav />
        </footer>
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
