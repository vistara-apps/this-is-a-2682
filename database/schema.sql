-- Reddit Pulse Database Schema
-- This file contains the complete database schema for Reddit Pulse application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    subscription_tier TEXT DEFAULT 'Free' CHECK (subscription_tier IN ('Free', 'Basic', 'Pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitored Subreddits table
CREATE TABLE IF NOT EXISTS monitored_subreddits (
    subreddit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    members INTEGER DEFAULT 0,
    description TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Tracked Keywords table
CREATE TABLE IF NOT EXISTS tracked_keywords (
    keyword_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    sentiment_threshold DECIMAL(3,2) DEFAULT 0.5 CHECK (sentiment_threshold >= 0 AND sentiment_threshold <= 1),
    associated_subreddits TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, keyword)
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
    insight_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('trend', 'pain_point', 'opportunity')),
    description TEXT NOT NULL,
    source_keywords TEXT[] DEFAULT '{}',
    source_subreddits TEXT[] DEFAULT '{}',
    sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral', 'high', 'medium', 'low')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reddit Posts table (for caching and analysis)
CREATE TABLE IF NOT EXISTS reddit_posts (
    post_id TEXT PRIMARY KEY,
    subreddit TEXT NOT NULL,
    title TEXT NOT NULL,
    selftext TEXT,
    author TEXT,
    score INTEGER DEFAULT 0,
    upvote_ratio DECIMAL(3,2),
    num_comments INTEGER DEFAULT 0,
    created_utc TIMESTAMP WITH TIME ZONE,
    url TEXT,
    permalink TEXT,
    flair TEXT,
    thumbnail TEXT,
    is_video BOOLEAN DEFAULT FALSE,
    domain TEXT,
    gilded INTEGER DEFAULT 0,
    stickied BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reddit Comments table (for caching and analysis)
CREATE TABLE IF NOT EXISTS reddit_comments (
    comment_id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES reddit_posts(post_id) ON DELETE CASCADE,
    parent_id TEXT,
    author TEXT,
    body TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    created_utc TIMESTAMP WITH TIME ZONE,
    depth INTEGER DEFAULT 0,
    gilded INTEGER DEFAULT 0,
    stickied BOOLEAN DEFAULT FALSE,
    edited BOOLEAN DEFAULT FALSE,
    controversiality INTEGER DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sentiment Analysis table
CREATE TABLE IF NOT EXISTS sentiment_analysis (
    analysis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id TEXT NOT NULL, -- Can reference post_id or comment_id
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
    sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    score DECIMAL(4,3) CHECK (score >= -1 AND score <= 1), -- -1 (very negative) to 1 (very positive)
    emotions TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    explanation TEXT,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Log table
CREATE TABLE IF NOT EXISTS user_activity_log (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Tracking table (for rate limiting and billing)
CREATE TABLE IF NOT EXISTS api_usage (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_type TEXT NOT NULL CHECK (api_type IN ('reddit', 'openai', 'supabase')),
    endpoint TEXT,
    request_count INTEGER DEFAULT 1,
    tokens_used INTEGER DEFAULT 0,
    cost_cents INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, api_type, endpoint, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monitored_subreddits_user_id ON monitored_subreddits(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_keywords_user_id ON tracked_keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(type);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_created_utc ON reddit_posts(created_utc DESC);
CREATE INDEX IF NOT EXISTS idx_reddit_comments_post_id ON reddit_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_content ON sentiment_analysis(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON api_usage(user_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitored_subreddits_updated_at BEFORE UPDATE ON monitored_subreddits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracked_keywords_updated_at BEFORE UPDATE ON tracked_keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reddit_posts_updated_at BEFORE UPDATE ON reddit_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reddit_comments_updated_at BEFORE UPDATE ON reddit_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subreddits" ON monitored_subreddits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subreddits" ON monitored_subreddits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subreddits" ON monitored_subreddits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subreddits" ON monitored_subreddits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own keywords" ON tracked_keywords FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own keywords" ON tracked_keywords FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own keywords" ON tracked_keywords FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own keywords" ON tracked_keywords FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own insights" ON insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own insights" ON insights FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON user_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own api usage" ON api_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api usage" ON api_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reddit posts and comments are public (no RLS needed)
-- Sentiment analysis is also public as it's derived from public Reddit data

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email, subscription_tier)
    VALUES (NEW.id, NEW.email, 'Free');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity_log (user_id, activity_type, activity_data)
    VALUES (p_user_id, p_activity_type, p_activity_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to track API usage
CREATE OR REPLACE FUNCTION public.track_api_usage(
    p_user_id UUID,
    p_api_type TEXT,
    p_endpoint TEXT DEFAULT NULL,
    p_request_count INTEGER DEFAULT 1,
    p_tokens_used INTEGER DEFAULT 0,
    p_cost_cents INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO api_usage (user_id, api_type, endpoint, request_count, tokens_used, cost_cents)
    VALUES (p_user_id, p_api_type, p_endpoint, p_request_count, p_tokens_used, p_cost_cents)
    ON CONFLICT (user_id, api_type, endpoint, date)
    DO UPDATE SET
        request_count = api_usage.request_count + p_request_count,
        tokens_used = api_usage.tokens_used + p_tokens_used,
        cost_cents = api_usage.cost_cents + p_cost_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for user dashboard statistics
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    u.user_id,
    u.email,
    u.subscription_tier,
    COUNT(DISTINCT ms.subreddit_id) as monitored_subreddits_count,
    COUNT(DISTINCT tk.keyword_id) as tracked_keywords_count,
    COUNT(DISTINCT i.insight_id) as insights_count,
    COUNT(DISTINCT CASE WHEN i.created_at >= NOW() - INTERVAL '7 days' THEN i.insight_id END) as recent_insights_count
FROM users u
LEFT JOIN monitored_subreddits ms ON u.user_id = ms.user_id
LEFT JOIN tracked_keywords tk ON u.user_id = tk.user_id
LEFT JOIN insights i ON u.user_id = i.user_id
GROUP BY u.user_id, u.email, u.subscription_tier;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert some sample data for development (optional)
-- This will be ignored if the tables already have data

-- Sample user (will be created automatically via trigger when user signs up)
-- Sample monitored subreddits, keywords, and insights can be added here for testing
