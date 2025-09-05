import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '1',
    email: 'demo@redditpulse.com',
    subscriptionTier: 'Pro',
    created_at: new Date().toISOString()
  });

  const [monitoredSubreddits, setMonitoredSubreddits] = useState([]);
  const [trackedKeywords, setTrackedKeywords] = useState([]);
  const [insights, setInsights] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubreddits = localStorage.getItem('monitoredSubreddits');
    const savedKeywords = localStorage.getItem('trackedKeywords');
    const savedInsights = localStorage.getItem('insights');

    if (savedSubreddits) {
      setMonitoredSubreddits(JSON.parse(savedSubreddits));
    }
    if (savedKeywords) {
      setTrackedKeywords(JSON.parse(savedKeywords));
    }
    if (savedInsights) {
      setInsights(JSON.parse(savedInsights));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('monitoredSubreddits', JSON.stringify(monitoredSubreddits));
  }, [monitoredSubreddits]);

  useEffect(() => {
    localStorage.setItem('trackedKeywords', JSON.stringify(trackedKeywords));
  }, [trackedKeywords]);

  useEffect(() => {
    localStorage.setItem('insights', JSON.stringify(insights));
  }, [insights]);

  const addMonitoredSubreddit = (subreddit) => {
    const newSubreddit = {
      subredditId: Date.now().toString(),
      name: subreddit.name,
      url: `https://reddit.com/r/${subreddit.name}`,
      members: subreddit.members,
      description: subreddit.description,
      category: subreddit.category
    };
    setMonitoredSubreddits(prev => [...prev, newSubreddit]);
  };

  const removeMonitoredSubreddit = (subredditId) => {
    setMonitoredSubreddits(prev => prev.filter(sub => sub.subredditId !== subredditId));
  };

  const addTrackedKeyword = (keyword) => {
    const newKeyword = {
      keywordId: Date.now().toString(),
      keyword: keyword.keyword,
      sentiment_threshold: keyword.sentiment_threshold || 0.5,
      associated_subreddits: keyword.associated_subreddits || [],
      created_at: new Date().toISOString()
    };
    setTrackedKeywords(prev => [...prev, newKeyword]);
  };

  const removeTrackedKeyword = (keywordId) => {
    setTrackedKeywords(prev => prev.filter(kw => kw.keywordId !== keywordId));
  };

  const addInsight = (insight) => {
    const newInsight = {
      insightId: Date.now().toString(),
      type: insight.type,
      description: insight.description,
      source_keywords: insight.source_keywords || [],
      source_subreddits: insight.source_subreddits || [],
      sentiment: insight.sentiment,
      created_at: new Date().toISOString()
    };
    setInsights(prev => [newInsight, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
      monitoredSubreddits,
      trackedKeywords,
      insights,
      addMonitoredSubreddit,
      removeMonitoredSubreddit,
      addTrackedKeyword,
      removeTrackedKeyword,
      addInsight
    }}>
      {children}
    </AppContext.Provider>
  );
};