import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubredditFinder from './components/SubredditFinder';
import KeywordTracker from './components/KeywordTracker';
import InsightsSummary from './components/InsightsSummary';
import { AppProvider } from './context/AppContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'subreddits':
        return <SubredditFinder />;
      case 'keywords':
        return <KeywordTracker />;
      case 'insights':
        return <InsightsSummary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;