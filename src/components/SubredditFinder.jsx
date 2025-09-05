import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Users, TrendingUp, Eye } from 'lucide-react';
import Card from './ui/Card';
import SearchInput from './ui/SearchInput';
import Button from './ui/Button';

const SubredditFinder = () => {
  const { addMonitoredSubreddit, monitoredSubreddits } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock Reddit API data
  const mockSubreddits = {
    'startup': [
      { name: 'startups', members: 850000, description: 'A community for entrepreneurs and startup enthusiasts', category: 'Business', activity: 'Very High' },
      { name: 'Entrepreneur', members: 450000, description: 'For entrepreneurs and small business owners', category: 'Business', activity: 'High' },
      { name: 'smallbusiness', members: 320000, description: 'Community for small business owners', category: 'Business', activity: 'High' },
      { name: 'YCombinator', members: 180000, description: 'Y Combinator startup accelerator community', category: 'Business', activity: 'Medium' },
    ],
    'programming': [
      { name: 'programming', members: 2800000, description: 'Computer programming discussion', category: 'Technology', activity: 'Very High' },
      { name: 'learnprogramming', members: 2200000, description: 'Learn programming and software development', category: 'Education', activity: 'Very High' },
      { name: 'webdev', members: 780000, description: 'Web development community', category: 'Technology', activity: 'High' },
      { name: 'javascript', members: 1200000, description: 'JavaScript programming language', category: 'Technology', activity: 'Very High' },
    ],
    'marketing': [
      { name: 'marketing', members: 750000, description: 'Digital marketing strategies and discussions', category: 'Business', activity: 'High' },
      { name: 'socialmedia', members: 420000, description: 'Social media marketing and trends', category: 'Marketing', activity: 'High' },
      { name: 'SEO', members: 280000, description: 'Search engine optimization community', category: 'Marketing', activity: 'Medium' },
      { name: 'PPC', members: 90000, description: 'Pay-per-click advertising discussions', category: 'Marketing', activity: 'Medium' },
    ]
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let results = [];
      
      // Search through mock data
      Object.keys(mockSubreddits).forEach(category => {
        if (category.includes(query)) {
          results = [...results, ...mockSubreddits[category]];
        }
      });
      
      // If no direct match, provide general programming results
      if (results.length === 0) {
        results = mockSubreddits['programming'] || [];
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleAddSubreddit = (subreddit) => {
    // Check if already monitored
    const isAlreadyMonitored = monitoredSubreddits.some(
      monitored => monitored.name === subreddit.name
    );
    
    if (!isAlreadyMonitored) {
      addMonitoredSubreddit(subreddit);
    }
  };

  const isAlreadyMonitored = (subredditName) => {
    return monitoredSubreddits.some(monitored => monitored.name === subredditName);
  };

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Niche Subreddit Finder</h1>
        <p className="text-gray-600">Discover relevant and active subreddits for your industry or niche</p>
      </div>

      {/* Search Section */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Enter your niche or industry (e.g., startup, programming, marketing)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="whitespace-nowrap"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Subreddits
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Found {searchResults.length} relevant subreddits
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((subreddit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        r/{subreddit.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(subreddit.activity)}`}>
                        {subreddit.activity} Activity
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{subreddit.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{subreddit.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{subreddit.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://reddit.com/r/${subreddit.name}`, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddSubreddit(subreddit)}
                      disabled={isAlreadyMonitored(subreddit.name)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isAlreadyMonitored(subreddit.name) ? 'Monitoring' : 'Monitor'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Currently Monitored */}
      {monitoredSubreddits.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Currently Monitoring ({monitoredSubreddits.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoredSubreddits.map((subreddit) => (
              <Card key={subreddit.subredditId} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">r/{subreddit.name}</h3>
                  <span className="text-green-600 text-sm font-medium">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{subreddit.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{subreddit.members?.toLocaleString()} members</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !isSearching && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Discover Your Niche Communities</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Enter keywords related to your industry or interests to find active and relevant subreddits for monitoring.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['startup', 'programming', 'marketing', 'fitness', 'cooking'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setTimeout(handleSearch, 100);
                }}
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

export default SubredditFinder;