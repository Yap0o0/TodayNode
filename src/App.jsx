import React, { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import TabNav from './components/TabNav';
import RecordPage from './pages/RecordPage';
import CalendarPage from './pages/CalendarPage';
import DiaryPage from './pages/DiaryPage';
import AnalysisPage from './pages/AnalysisPage';

function App() {
  const [activeTab, setActiveTab] = useState('record');

  const renderContent = () => {
    switch (activeTab) {
      case 'record':
        return <RecordPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'diary':
        return <DiaryPage />;
      case 'analysis':
        return <AnalysisPage />;
      default:
        return <RecordPage />;
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-grow p-4">
        {renderContent()}
      </div>
    </Layout>
  );
}

export default App;
