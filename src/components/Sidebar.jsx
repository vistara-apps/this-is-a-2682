import React from 'react';
import { 
  Home, 
  Search, 
  Target, 
  TrendingUp, 
  Settings, 
  Crown,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'subreddits', label: 'Find Subreddits', icon: Search },
    { id: 'keywords', label: 'Track Keywords', icon: Target },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ];

  const bottomItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 gradient-bg text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Reddit Pulse</h1>
            <p className="text-gray-400 text-sm">Niche Insights</p>
          </div>
        </div>
      </div>

      {/* Subscription Badge */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 flex items-center space-x-2">
          <Crown className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Pro Plan</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 pb-6">
        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;