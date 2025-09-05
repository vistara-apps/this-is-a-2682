import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Target, TrendingUp, Eye } from 'lucide-react';
import Card from './ui/Card';

const Dashboard = () => {
  const { monitoredSubreddits, trackedKeywords, insights } = useApp();

  const stats = [
    {
      title: 'Monitored Subreddits',
      value: monitoredSubreddits.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tracked Keywords',
      value: trackedKeywords.length,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Generated Insights',
      value: insights.length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Monitors',
      value: monitoredSubreddits.length + trackedKeywords.length,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentInsights = insights.slice(0, 5);
  const recentSubreddits = monitoredSubreddits.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your Reddit insights and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Insights</h2>
          {recentInsights.length > 0 ? (
            <div className="space-y-4">
              {recentInsights.map((insight) => (
                <div key={insight.insightId} className="border-l-4 border-primary pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.type === 'trend' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{insight.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Sentiment: {insight.sentiment > 0 ? 'Positive' : insight.sentiment < 0 ? 'Negative' : 'Neutral'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No insights generated yet</p>
              <p className="text-sm">Start tracking keywords to generate insights</p>
            </div>
          )}
        </Card>

        {/* Monitored Subreddits */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monitored Subreddits</h2>
          {recentSubreddits.length > 0 ? (
            <div className="space-y-4">
              {recentSubreddits.map((subreddit) => (
                <div key={subreddit.subredditId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">r/{subreddit.name}</h3>
                    <p className="text-sm text-gray-600">{subreddit.members?.toLocaleString()} members</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No subreddits monitored yet</p>
              <p className="text-sm">Use the Subreddit Finder to start monitoring</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Find New Subreddits</p>
              <p className="text-sm text-gray-600">Discover relevant communities</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Add Keywords</p>
              <p className="text-sm text-gray-600">Track new terms and phrases</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Generate Report</p>
              <p className="text-sm text-gray-600">Create insights summary</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;