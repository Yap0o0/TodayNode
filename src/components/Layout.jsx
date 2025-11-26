import React from 'react';

/**
 * 앱의 메인 레이아웃을 정의하는 컴포넌트입니다.
 * 헤더와 자식 요소를 렌더링합니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {React.ReactNode} props.children - 레이아웃 내부에 렌더링될 자식 요소
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-4 shadow-md">
        <h1 className="text-2xl font-bold">하루 노드</h1>
        <p className="text-sm">오늘의 소확행을 기록하세요</p>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
