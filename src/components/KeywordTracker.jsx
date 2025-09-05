import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const KeywordTracker = () => {
  const { trackedKeywords, addTrackedKeyword, removeTrackedKeyword, monitoredSubreddits, addInsight } = useApp();
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [sentimentThreshold, setSentimentThreshold] = useState(0.5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const keywordData = {
      keyword: newKeyword.trim(),
      sentiment_threshold: sentimentThreshold,
      associated_subreddits: selectedSubreddits
    };
    
    addTrackedKeyword(keywordData);
    
    // Generate mock insight
    setTimeout(() => {
      const insights = [
        {
          type: 'trend',
          description: `"${newKeyword}" mentions have increased by 34% this week across monitored subreddits`,
          sentiment: 0.2,
          source_keywords: [newKeyword],
          source_subreddits: selectedSubreddits
        },
        {
          type: 'pain_point',
          description: `Users frequently mention "${newKeyword}" in relation to pricing concerns and feature requests`,
          sentiment: -0.3,
          source_keywords: [newKeyword],
          source_subreddits: selectedSubreddits
        }
      ];
      
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      addInsight(randomInsight);
    }, 2000);
    
    // Reset form
    setNewKeyword('');
    setSelectedSubreddits([]);
    setSentimentThreshold(0.5);
  };

  const handleAnalyzeKeyword = async (keyword) => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const analysisResults = [
        {
          type: 'trend',
          description: `"${keyword.keyword}" has been trending upward with 150+ mentions this week`,
          sentiment: 0.4,
          source_keywords: [keyword.keyword],
          source_subreddits: keyword.associated_subreddits
        },
        {
          type: 'pain_point',
          description: `Common complaints about "${keyword.keyword}" include high cost and complexity`,
          sentiment: -0.6,
          source_keywords: [keyword.keyword],
          source_subreddits: keyword.associated_subreddits
        }
      ];
      
      const randomResult = analysisResults[Math.floor(Math.random() * analysisResults.length)];
      addInsight(randomResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.2) return 'text-green-600 bg-green-100';
    if (sentiment < -0.2) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.2) return 'Positive';
    if (sentiment < -0.2) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword & Sentiment Tracker</h1>
        <p className="text-gray-600">Monitor specific keywords and track sentiment across your monitored subreddits</p>
      </div>

      {/* Add New Keyword */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Keyword</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keyword or Phrase
            </label>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="e.g., customer service, pricing, feature request"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sentiment Threshold ({sentimentThreshold})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sentimentThreshold}
              onChange={(e) => setSentimentThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
          
          {monitoredSubreddits.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monitor in Subreddits (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {monitoredSubreddits.map((subreddit) => (
                  <label key={subreddit.subredditId} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSubreddits.includes(subreddit.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubreddits([...selectedSubreddits, subreddit.name]);
                        } else {
                          setSelectedSubreddits(selectedSubreddits.filter(s => s !== subreddit.name));
                        }
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">r/{subreddit.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleAddKeyword}
            disabled={!newKeyword.trim()}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </Card>

      {/* Tracked Keywords */}
      {trackedKeywords.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Tracked Keywords ({trackedKeywords.length})
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {trackedKeywords.map((keyword) => (
              <Card key={keyword.keywordId} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        "{keyword.keyword}"
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Threshold: {keyword.sentiment_threshold}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Added: {new Date(keyword.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {keyword.associated_subreddits.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Monitoring in:</p>
                        <div className="flex flex-wrap gap-1">
                          {keyword.associated_subreddits.map((subreddit, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              r/{subreddit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Mock Recent Activity */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">Recent mentions: 23</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(0.3)}`}>
                          {getSentimentLabel(0.3)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">Weekly trend: +15%</span>
                        <span className="text-green-600 text-xs font-medium">↑ Trending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyzeKeyword(keyword)}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTrackedKeyword(keyword.keywordId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Tracking Keywords</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Add keywords or phrases you want to monitor across Reddit. Track sentiment and get insights about user discussions.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['pricing', 'customer service', 'feature request', 'bug report', 'recommendation'].map((term) => (
              <button
                key={term}
                onClick={() => setNewKeyword(term)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default KeywordTracker;