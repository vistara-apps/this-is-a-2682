import axios from 'axios';

// Reddit API configuration
const REDDIT_BASE_URL = 'https://www.reddit.com';
const USER_AGENT = 'RedditPulse/1.0.0';

// Create axios instance with default config
const redditApi = axios.create({
  baseURL: REDDIT_BASE_URL,
  headers: {
    'User-Agent': USER_AGENT,
  },
  timeout: 10000,
});

// Rate limiting helper
class RateLimiter {
  constructor(maxRequests = 60, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.checkLimit();
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter();

// Reddit API service
export const redditApiService = {
  // Search for subreddits by query
  async searchSubreddits(query, limit = 25) {
    try {
      await rateLimiter.checkLimit();
      
      const response = await redditApi.get('/subreddits/search.json', {
        params: {
          q: query,
          limit,
          type: 'sr',
          sort: 'relevance'
        }
      });

      return {
        data: response.data.data.children.map(child => ({
          name: child.data.display_name,
          title: child.data.title,
          description: child.data.public_description || child.data.description,
          subscribers: child.data.subscribers,
          created: child.data.created_utc,
          over18: child.data.over18,
          url: child.data.url,
          icon: child.data.icon_img || child.data.community_icon,
          banner: child.data.banner_img,
          primaryColor: child.data.primary_color,
          keyColor: child.data.key_color,
          activeUserCount: child.data.active_user_count,
          category: this.categorizeSubreddit(child.data.display_name, child.data.description)
        })),
        error: null
      };
    } catch (error) {
      console.error('Error searching subreddits:', error);
      return {
        data: [],
        error: error.message
      };
    }
  },

  // Get subreddit posts
  async getSubredditPosts(subredditName, sort = 'hot', limit = 25, timeframe = 'day') {
    try {
      await rateLimiter.checkLimit();
      
      const response = await redditApi.get(`/r/${subredditName}/${sort}.json`, {
        params: {
          limit,
          t: timeframe
        }
      });

      return {
        data: response.data.data.children.map(child => ({
          id: child.data.id,
          title: child.data.title,
          selftext: child.data.selftext,
          author: child.data.author,
          score: child.data.score,
          upvoteRatio: child.data.upvote_ratio,
          numComments: child.data.num_comments,
          created: child.data.created_utc,
          url: child.data.url,
          permalink: child.data.permalink,
          subreddit: child.data.subreddit,
          flair: child.data.link_flair_text,
          thumbnail: child.data.thumbnail,
          isVideo: child.data.is_video,
          domain: child.data.domain,
          gilded: child.data.gilded,
          stickied: child.data.stickied,
          locked: child.data.locked,
          archived: child.data.archived
        })),
        error: null
      };
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      return {
        data: [],
        error: error.message
      };
    }
  },

  // Get post comments
  async getPostComments(subredditName, postId, sort = 'best', limit = 100) {
    try {
      await rateLimiter.checkLimit();
      
      const response = await redditApi.get(`/r/${subredditName}/comments/${postId}.json`, {
        params: {
          sort,
          limit
        }
      });

      const comments = [];
      
      const extractComments = (commentData, depth = 0) => {
        if (!commentData || !commentData.data) return;
        
        const comment = commentData.data;
        if (comment.body && comment.body !== '[deleted]' && comment.body !== '[removed]') {
          comments.push({
            id: comment.id,
            author: comment.author,
            body: comment.body,
            score: comment.score,
            created: comment.created_utc,
            depth,
            parentId: comment.parent_id,
            gilded: comment.gilded,
            stickied: comment.stickied,
            edited: comment.edited,
            controversiality: comment.controversiality
          });
        }

        if (comment.replies && comment.replies.data && comment.replies.data.children) {
          comment.replies.data.children.forEach(reply => {
            extractComments(reply, depth + 1);
          });
        }
      };

      if (response.data[1] && response.data[1].data && response.data[1].data.children) {
        response.data[1].data.children.forEach(comment => {
          extractComments(comment);
        });
      }

      return {
        data: comments,
        error: null
      };
    } catch (error) {
      console.error('Error fetching post comments:', error);
      return {
        data: [],
        error: error.message
      };
    }
  },

  // Search posts across Reddit
  async searchPosts(query, subreddit = null, sort = 'relevance', timeframe = 'all', limit = 25) {
    try {
      await rateLimiter.checkLimit();
      
      const searchUrl = subreddit ? `/r/${subreddit}/search.json` : '/search.json';
      const params = {
        q: query,
        sort,
        t: timeframe,
        limit,
        type: 'link'
      };

      if (subreddit) {
        params.restrict_sr = 'on';
      }

      const response = await redditApi.get(searchUrl, { params });

      return {
        data: response.data.data.children.map(child => ({
          id: child.data.id,
          title: child.data.title,
          selftext: child.data.selftext,
          author: child.data.author,
          score: child.data.score,
          upvoteRatio: child.data.upvote_ratio,
          numComments: child.data.num_comments,
          created: child.data.created_utc,
          url: child.data.url,
          permalink: child.data.permalink,
          subreddit: child.data.subreddit,
          flair: child.data.link_flair_text,
          thumbnail: child.data.thumbnail
        })),
        error: null
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      return {
        data: [],
        error: error.message
      };
    }
  },

  // Get trending subreddits
  async getTrendingSubreddits() {
    try {
      await rateLimiter.checkLimit();
      
      const response = await redditApi.get('/subreddits/popular.json', {
        params: { limit: 50 }
      });

      return {
        data: response.data.data.children.map(child => ({
          name: child.data.display_name,
          title: child.data.title,
          description: child.data.public_description,
          subscribers: child.data.subscribers,
          activeUsers: child.data.active_user_count,
          category: this.categorizeSubreddit(child.data.display_name, child.data.description)
        })),
        error: null
      };
    } catch (error) {
      console.error('Error fetching trending subreddits:', error);
      return {
        data: [],
        error: error.message
      };
    }
  },

  // Categorize subreddit based on name and description
  categorizeSubreddit(name, description = '') {
    const categories = {
      'Technology': ['programming', 'tech', 'software', 'coding', 'javascript', 'python', 'webdev', 'machinelearning', 'artificial', 'crypto', 'blockchain'],
      'Business': ['business', 'entrepreneur', 'startup', 'marketing', 'finance', 'investing', 'stocks', 'economy'],
      'Gaming': ['gaming', 'games', 'xbox', 'playstation', 'nintendo', 'steam', 'esports'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'space', 'astronomy', 'medicine'],
      'Entertainment': ['movies', 'television', 'music', 'books', 'art', 'photography'],
      'Sports': ['sports', 'football', 'basketball', 'soccer', 'baseball', 'hockey', 'tennis'],
      'Lifestyle': ['fitness', 'health', 'food', 'cooking', 'fashion', 'travel', 'diy'],
      'Education': ['education', 'learning', 'university', 'college', 'study', 'academic'],
      'News': ['news', 'worldnews', 'politics', 'current', 'breaking']
    };

    const text = `${name} ${description}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'General';
  },

  // Get subreddit info
  async getSubredditInfo(subredditName) {
    try {
      await rateLimiter.checkLimit();
      
      const response = await redditApi.get(`/r/${subredditName}/about.json`);
      const data = response.data.data;

      return {
        data: {
          name: data.display_name,
          title: data.title,
          description: data.public_description || data.description,
          subscribers: data.subscribers,
          activeUsers: data.active_user_count,
          created: data.created_utc,
          over18: data.over18,
          url: data.url,
          icon: data.icon_img || data.community_icon,
          banner: data.banner_img,
          primaryColor: data.primary_color,
          keyColor: data.key_color,
          category: this.categorizeSubreddit(data.display_name, data.description)
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching subreddit info:', error);
      return {
        data: null,
        error: error.message
      };
    }
  }
};

export default redditApiService;
