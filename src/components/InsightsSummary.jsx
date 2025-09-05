import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, AlertTriangle, Filter, Download, Calendar } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const InsightsSummary = () => {
  const { insights, trackedKeywords, monitoredSubreddits } = useApp();
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const filteredInsights = insights.filter(insight => {
    const typeMatch = filterType === 'all' || insight.type === filterType;
    
    let dateMatch = true;
    if (filterDate !== 'all') {
      const insightDate = new Date(insight.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now - insightDate) / (1000 * 60 * 60 * 24));
      
      switch (filterDate) {
        case 'today':
          dateMatch = daysDiff === 0;
          break;
        case 'week':
          dateMatch = daysDiff <= 7;
          break;
        case 'month':
          dateMatch = daysDiff <= 30;
          break;
        default:
          dateMatch = true;
      }
    }
    
    return typeMatch && dateMatch;
  });

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.2) return 'text-green-600 bg-green-100 border-green-200';
    if (sentiment < -0.2) return 'text-red-600 bg-red-100 border-red-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.2) return 'Positive';
    if (sentiment < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getTypeIcon = (type) => {
    return type === 'trend' ? TrendingUp : AlertTriangle;
  };

  const getTypeColor = (type) => {
    return type === 'trend' 
      ? 'text-blue-600 bg-blue-100 border-blue-200'
      : 'text-orange-600 bg-orange-100 border-orange-200';
  };

  const handleExportInsights = () => {
    const exportData = {
      export_date: new Date().toISOString(),
      total_insights: filteredInsights.length,
      insights: filteredInsights.map(insight => ({
        id: insight.insightId,
        type: insight.type,
        description: insight.description,
        sentiment: insight.sentiment,
        sentiment_label: getSentimentLabel(insight.sentiment),
        source_keywords: insight.source_keywords,
        source_subreddits: insight.source_subreddits,
        created_at: insight.created_at
      }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reddit-pulse-insights-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const insightStats = {
    total: insights.length,
    trends: insights.filter(i => i.type === 'trend').length,
    painPoints: insights.filter(i => i.type === 'pain_point').length,
    positive: insights.filter(i => i.sentiment > 0.2).length,
    negative: insights.filter(i => i.sentiment < -0.2).length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights & Trends</h1>
            <p className="text-gray-600">AI-generated insights from your monitored keywords and subreddits</p>
          </div>
          <Button onClick={handleExportInsights} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Insights
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{insightStats.total}</div>
          <div className="text-sm text-gray-600">Total Insights</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{insightStats.trends}</div>
          <div className="text-sm text-gray-600">Trends</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{insightStats.painPoints}</div>
          <div className="text-sm text-gray-600">Pain Points</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{insightStats.positive}</div>
          <div className="text-sm text-gray-600">Positive</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{insightStats.negative}</div>
          <div className="text-sm text-gray-600">Negative</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="trend">Trends</option>
              <option value="pain_point">Pain Points</option>
            </select>
            
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredInsights.length} of {insights.length} insights
          </div>
        </div>
      </Card>

      {/* Insights List */}
      {filteredInsights.length > 0 ? (
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const TypeIcon = getTypeIcon(insight.type);
            return (
              <Card key={insight.insightId} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${getTypeColor(insight.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(insight.type)}`}>
                            {insight.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(insight.sentiment)}`}>
                            {getSentimentLabel(insight.sentiment)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {insight.description}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    {insight.source_keywords.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Keywords: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {insight.source_keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {insight.source_subreddits.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Subreddits: </span>
                        <div className="inline-flex flex-wrap gap-1 mt-1">
                          {insight.source_subreddits.map((subreddit, index) => (
                            <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                              r/{subreddit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sentiment Score */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sentiment Score:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                      <div
                        className={`h-2 rounded-full ${
                          insight.sentiment > 0 ? 'bg-green-500' : insight.sentiment < 0 ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${Math.abs(insight.sentiment) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {insight.sentiment > 0 ? '+' : ''}{(insight.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {insights.length === 0 ? 'No Insights Generated Yet' : 'No Insights Match Your Filters'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {insights.length === 0 
              ? 'Start tracking keywords and monitoring subreddits to generate AI-powered insights about trends and pain points.'
              : 'Try adjusting your filters to see more insights, or check back later for new analysis results.'
            }
          </p>
          {insights.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline">Find Subreddits</Button>
              <Button>Track Keywords</Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default InsightsSummary;