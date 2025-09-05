import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Target, 
  TrendingUp, 
  Settings, 
  Crown,
  BarChart3,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { useApp } from '../context/AppContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user: authUser, signOut } = useAuth();
  const { user } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getSubscriptionColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'pro':
        return 'from-yellow-500 to-orange-500';
      case 'basic':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

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

      {/* User Profile & Subscription Badge */}
      <div className="px-6 py-4 space-y-3">
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">
                {authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-400">{authUser?.email}</div>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Account</div>
                <div className="text-sm text-white">{authUser?.email}</div>
              </div>
              <div className="p-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Badge */}
        <div className={`bg-gradient-to-r ${getSubscriptionColor(user?.subscription_tier || 'Free')} rounded-lg p-3 flex items-center space-x-2`}>
          {(user?.subscription_tier === 'Pro' || user?.subscription_tier === 'pro') && <Crown className="w-4 h-4 text-white" />}
          <span className="text-sm font-medium text-white">{user?.subscription_tier || 'Free'} Plan</span>
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
