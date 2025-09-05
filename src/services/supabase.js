import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  MONITORED_SUBREDDITS: 'monitored_subreddits',
  TRACKED_KEYWORDS: 'tracked_keywords',
  INSIGHTS: 'insights',
  REDDIT_POSTS: 'reddit_posts',
  SENTIMENT_ANALYSIS: 'sentiment_analysis'
};

// User management functions
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database service functions
export const dbService = {
  // Users
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  async getUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Monitored Subreddits
  async getMonitoredSubreddits(userId) {
    const { data, error } = await supabase
      .from(TABLES.MONITORED_SUBREDDITS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addMonitoredSubreddit(subredditData) {
    const { data, error } = await supabase
      .from(TABLES.MONITORED_SUBREDDITS)
      .insert([subredditData])
      .select()
      .single();
    return { data, error };
  },

  async removeMonitoredSubreddit(subredditId) {
    const { data, error } = await supabase
      .from(TABLES.MONITORED_SUBREDDITS)
      .delete()
      .eq('subreddit_id', subredditId);
    return { data, error };
  },

  // Tracked Keywords
  async getTrackedKeywords(userId) {
    const { data, error } = await supabase
      .from(TABLES.TRACKED_KEYWORDS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addTrackedKeyword(keywordData) {
    const { data, error } = await supabase
      .from(TABLES.TRACKED_KEYWORDS)
      .insert([keywordData])
      .select()
      .single();
    return { data, error };
  },

  async removeTrackedKeyword(keywordId) {
    const { data, error } = await supabase
      .from(TABLES.TRACKED_KEYWORDS)
      .delete()
      .eq('keyword_id', keywordId);
    return { data, error };
  },

  // Insights
  async getInsights(userId, limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.INSIGHTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async addInsight(insightData) {
    const { data, error } = await supabase
      .from(TABLES.INSIGHTS)
      .insert([insightData])
      .select()
      .single();
    return { data, error };
  },

  // Reddit Posts (for caching)
  async getRedditPosts(subredditName, limit = 100) {
    const { data, error } = await supabase
      .from(TABLES.REDDIT_POSTS)
      .select('*')
      .eq('subreddit', subredditName)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async saveRedditPost(postData) {
    const { data, error } = await supabase
      .from(TABLES.REDDIT_POSTS)
      .upsert([postData])
      .select()
      .single();
    return { data, error };
  }
};
