import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { dbService } from '../services/supabase';
import { redditApiService } from '../services/redditApi';
import { openaiService } from '../services/openaiService';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [monitoredSubreddits, setMonitoredSubreddits] = useState([]);
  const [trackedKeywords, setTrackedKeywords] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data when auth user changes
  useEffect(() => {
    if (authUser) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setUser(null);
      setMonitoredSubreddits([]);
      setTrackedKeywords([]);
      setInsights([]);
    }
  }, [authUser]);

  const loadUserData = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      
      // Load user profile
      const { data: userProfile, error: userError } = await dbService.getUser(authUser.id);
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error loading user profile:', userError);
      } else if (userProfile) {
        setUser(userProfile);
      }

      // Load monitored subreddits
      const { data: subreddits, error: subredditsError } = await dbService.getMonitoredSubreddits(authUser.id);
      if (subredditsError) {
        console.error('Error loading subreddits:', subredditsError);
      } else {
        setMonitoredSubreddits(subreddits || []);
      }

      // Load tracked keywords
      const { data: keywords, error: keywordsError } = await dbService.getTrackedKeywords(authUser.id);
      if (keywordsError) {
        console.error('Error loading keywords:', keywordsError);
      } else {
        setTrackedKeywords(keywords || []);
      }

      // Load insights
      const { data: insightsData, error: insightsError } = await dbService.getInsights(authUser.id);
      if (insightsError) {
        console.error('Error loading insights:', insightsError);
      } else {
        setInsights(insightsData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Fallback to localStorage for demo mode
  useEffect(() => {
    if (!authUser) {
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
    }
  }, [authUser]);

  // Save to localStorage when data changes (fallback for demo mode)
  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('monitoredSubreddits', JSON.stringify(monitoredSubreddits));
    }
  }, [monitoredSubreddits, authUser]);

  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('trackedKeywords', JSON.stringify(trackedKeywords));
    }
  }, [trackedKeywords, authUser]);

  useEffect(() => {
    if (!authUser) {
      localStorage.setItem('insights', JSON.stringify(insights));
    }
  }, [insights, authUser]);

  const addMonitoredSubreddit = async (subreddit) => {
    try {
      const newSubreddit = {
        subreddit_id: Date.now().toString(),
        user_id: authUser?.id || 'demo',
        name: subreddit.name,
        url: `https://reddit.com/r/${subreddit.name}`,
        members: subreddit.members || subreddit.subscribers,
        description: subreddit.description,
        category: subreddit.category,
        created_at: new Date().toISOString()
      };

      if (authUser) {
        const { data, error } = await dbService.addMonitoredSubreddit(newSubreddit);
        if (error) {
          console.error('Error adding subreddit:', error);
          toast.error('Failed to add subreddit');
          return;
        }
        setMonitoredSubreddits(prev => [...prev, data]);
      } else {
        setMonitoredSubreddits(prev => [...prev, newSubreddit]);
      }
      
      toast.success(`Added r/${subreddit.name} to monitoring`);
    } catch (error) {
      console.error('Error adding subreddit:', error);
      toast.error('Failed to add subreddit');
    }
  };

  const removeMonitoredSubreddit = async (subredditId) => {
    try {
      if (authUser) {
        const { error } = await dbService.removeMonitoredSubreddit(subredditId);
        if (error) {
          console.error('Error removing subreddit:', error);
          toast.error('Failed to remove subreddit');
          return;
        }
      }
      
      setMonitoredSubreddits(prev => prev.filter(sub => sub.subreddit_id !== subredditId));
      toast.success('Subreddit removed from monitoring');
    } catch (error) {
      console.error('Error removing subreddit:', error);
      toast.error('Failed to remove subreddit');
    }
  };

  const addTrackedKeyword = async (keyword) => {
    try {
      const newKeyword = {
        keyword_id: Date.now().toString(),
        user_id: authUser?.id || 'demo',
        keyword: keyword.keyword,
        sentiment_threshold: keyword.sentiment_threshold || 0.5,
        associated_subreddits: keyword.associated_subreddits || [],
        created_at: new Date().toISOString()
      };

      if (authUser) {
        const { data, error } = await dbService.addTrackedKeyword(newKeyword);
        if (error) {
          console.error('Error adding keyword:', error);
          toast.error('Failed to add keyword');
          return;
        }
        setTrackedKeywords(prev => [...prev, data]);
      } else {
        setTrackedKeywords(prev => [...prev, newKeyword]);
      }
      
      toast.success(`Added "${keyword.keyword}" to tracking`);
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Failed to add keyword');
    }
  };

  const removeTrackedKeyword = async (keywordId) => {
    try {
      if (authUser) {
        const { error } = await dbService.removeTrackedKeyword(keywordId);
        if (error) {
          console.error('Error removing keyword:', error);
          toast.error('Failed to remove keyword');
          return;
        }
      }
      
      setTrackedKeywords(prev => prev.filter(kw => kw.keyword_id !== keywordId));
      toast.success('Keyword removed from tracking');
    } catch (error) {
      console.error('Error removing keyword:', error);
      toast.error('Failed to remove keyword');
    }
  };

  const addInsight = async (insight) => {
    try {
      const newInsight = {
        insight_id: Date.now().toString(),
        user_id: authUser?.id || 'demo',
        type: insight.type,
        description: insight.description,
        source_keywords: insight.source_keywords || [],
        source_subreddits: insight.source_subreddits || [],
        sentiment: insight.sentiment,
        created_at: new Date().toISOString()
      };

      if (authUser) {
        const { data, error } = await dbService.addInsight(newInsight);
        if (error) {
          console.error('Error adding insight:', error);
          toast.error('Failed to save insight');
          return;
        }
        setInsights(prev => [data, ...prev]);
      } else {
        setInsights(prev => [newInsight, ...prev]);
      }
    } catch (error) {
      console.error('Error adding insight:', error);
      toast.error('Failed to save insight');
    }
  };

  // Enhanced functions for Reddit API integration
  const searchSubreddits = async (query) => {
    try {
      setLoading(true);
      const { data, error } = await redditApiService.searchSubreddits(query);
      if (error) {
        toast.error('Failed to search subreddits');
        return [];
      }
      return data;
    } catch (error) {
      console.error('Error searching subreddits:', error);
      toast.error('Failed to search subreddits');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSubredditPosts = async (subredditName, options = {}) => {
    try {
      setLoading(true);
      const { data, error } = await redditApiService.getSubredditPosts(
        subredditName,
        options.sort || 'hot',
        options.limit || 25,
        options.timeframe || 'day'
      );
      if (error) {
        toast.error('Failed to fetch posts');
        return [];
      }
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (posts, context = '') => {
    try {
      setLoading(true);
      
      // Extract text content from posts
      const texts = posts.map(post => `${post.title} ${post.selftext || ''}`).filter(text => text.trim());
      
      if (texts.length === 0) {
        toast.error('No content to analyze');
        return null;
      }

      // Extract themes and generate insights
      const { data: themes, error: themesError } = await openaiService.extractThemes(texts, context);
      if (themesError) {
        toast.error('Failed to extract themes');
        return null;
      }

      const { data: insights, error: insightsError } = await openaiService.generateInsightsSummary(themes, context);
      if (insightsError) {
        toast.error('Failed to generate insights');
        return null;
      }

      // Save insights to database
      for (const insight of insights.insights) {
        await addInsight({
          type: insight.type,
          description: insight.description,
          sentiment: insight.impact,
          source_keywords: insight.keywords,
          source_subreddits: [context]
        });
      }

      toast.success('Insights generated successfully');
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const suggestSubreddits = async (niche, industry = '') => {
    try {
      setLoading(true);
      const { data, error } = await openaiService.suggestSubreddits(niche, industry);
      if (error) {
        toast.error('Failed to get subreddit suggestions');
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error getting subreddit suggestions:', error);
      toast.error('Failed to get subreddit suggestions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const suggestKeywords = async (niche, subreddits = []) => {
    try {
      setLoading(true);
      const { data, error } = await openaiService.suggestKeywords(niche, subreddits);
      if (error) {
        toast.error('Failed to get keyword suggestions');
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      toast.error('Failed to get keyword suggestions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      monitoredSubreddits,
      trackedKeywords,
      insights,
      loading,
      addMonitoredSubreddit,
      removeMonitoredSubreddit,
      addTrackedKeyword,
      removeTrackedKeyword,
      addInsight,
      searchSubreddits,
      getSubredditPosts,
      generateInsights,
      suggestSubreddits,
      suggestKeywords,
      loadUserData
    }}>
      {children}
    </AppContext.Provider>
  );
};
