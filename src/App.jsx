import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubredditFinder from './components/SubredditFinder';
import KeywordTracker from './components/KeywordTracker';
import InsightsSummary from './components/InsightsSummary';
import { AppProvider } from './context/AppContext';

const AppContent = () => {
  const { user, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Reddit Pulse...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

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
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
