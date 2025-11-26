import React from 'react';
import TabNav from './TabNav';

/**
 * 앱의 메인 레이아웃을 정의하는 컴포넌트입니다.
 * 헤더, 메인 콘텐츠 영역, 그리고 하단 탭 네비게이션으로 구성됩니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {React.ReactNode} props.children - 레이아웃 내부에 렌더링될 자식 요소 (페이지 콘텐츠)
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white text-gray-800 text-center py-4 shadow-sm border-b">
        <h1 className="text-xl font-bold">하루 노드</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow p-4 overflow-y-auto">
        {children}
      </main>

      {/* 하단 탭 네비게이션 */}
      <footer className="bg-white p-2 shadow-t">
        <TabNav />
      </footer>
    </div>
  );
};

export default Layout;
