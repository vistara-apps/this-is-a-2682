import OpenAI from 'openai';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export const openaiService = {
  // Analyze sentiment of text content
  async analyzeSentiment(text, context = '') {
    try {
      const prompt = `
        Analyze the sentiment of the following text and provide a detailed analysis.
        ${context ? `Context: ${context}` : ''}
        
        Text to analyze: "${text}"
        
        Please provide:
        1. Overall sentiment (positive, negative, neutral)
        2. Confidence score (0-1)
        3. Key emotional indicators
        4. Brief explanation of the sentiment
        
        Respond in JSON format:
        {
          "sentiment": "positive|negative|neutral",
          "confidence": 0.85,
          "score": 0.7,
          "emotions": ["excitement", "optimism"],
          "explanation": "Brief explanation of why this sentiment was detected",
          "keywords": ["key", "words", "that", "influenced", "sentiment"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze text sentiment accurately and provide detailed insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        data: {
          sentiment: 'neutral',
          confidence: 0.5,
          score: 0,
          emotions: [],
          explanation: 'Unable to analyze sentiment',
          keywords: []
        },
        error: error.message
      };
    }
  },

  // Analyze multiple texts for batch sentiment analysis
  async batchAnalyzeSentiment(texts, context = '') {
    try {
      const results = await Promise.all(
        texts.map(text => this.analyzeSentiment(text, context))
      );
      
      return {
        data: results.map(r => r.data),
        error: null
      };
    } catch (error) {
      console.error('Error in batch sentiment analysis:', error);
      return { data: [], error: error.message };
    }
  },

  // Extract key themes and topics from text content
  async extractThemes(texts, context = '') {
    try {
      const combinedText = Array.isArray(texts) ? texts.join('\n\n') : texts;
      
      const prompt = `
        Analyze the following text content and extract key themes, topics, and patterns.
        ${context ? `Context: ${context}` : ''}
        
        Content: "${combinedText}"
        
        Please identify:
        1. Main themes and topics
        2. Recurring patterns
        3. Key pain points mentioned
        4. Common concerns or interests
        5. Trending topics
        
        Respond in JSON format:
        {
          "themes": [
            {
              "name": "Theme name",
              "frequency": 15,
              "sentiment": "positive|negative|neutral",
              "keywords": ["related", "keywords"],
              "description": "Brief description of the theme"
            }
          ],
          "painPoints": [
            {
              "issue": "Pain point description",
              "frequency": 8,
              "severity": "high|medium|low",
              "keywords": ["related", "keywords"]
            }
          ],
          "trends": [
            {
              "topic": "Trending topic",
              "momentum": "rising|stable|declining",
              "keywords": ["related", "keywords"]
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content analysis expert. Extract themes, patterns, and insights from text content and provide structured analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error extracting themes:', error);
      return {
        data: {
          themes: [],
          painPoints: [],
          trends: []
        },
        error: error.message
      };
    }
  },

  // Generate insights summary from analyzed data
  async generateInsightsSummary(data, context = '') {
    try {
      const prompt = `
        Based on the following Reddit data analysis, generate actionable business insights.
        ${context ? `Context: ${context}` : ''}
        
        Data: ${JSON.stringify(data, null, 2)}
        
        Please provide:
        1. Key insights and findings
        2. Business opportunities identified
        3. Market trends observed
        4. User pain points and needs
        5. Actionable recommendations
        
        Respond in JSON format:
        {
          "summary": "Executive summary of key findings",
          "insights": [
            {
              "type": "trend|pain_point|opportunity",
              "title": "Insight title",
              "description": "Detailed description",
              "impact": "high|medium|low",
              "confidence": 0.85,
              "recommendations": ["actionable", "recommendations"],
              "keywords": ["relevant", "keywords"]
            }
          ],
          "opportunities": [
            {
              "title": "Business opportunity",
              "description": "Description of the opportunity",
              "market_size": "estimated market size or potential",
              "difficulty": "easy|medium|hard",
              "keywords": ["relevant", "keywords"]
            }
          ],
          "recommendations": [
            {
              "action": "Recommended action",
              "priority": "high|medium|low",
              "effort": "low|medium|high",
              "impact": "high|medium|low"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence analyst specializing in social media insights. Generate actionable business insights from Reddit data analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error generating insights summary:', error);
      return {
        data: {
          summary: 'Unable to generate insights summary',
          insights: [],
          opportunities: [],
          recommendations: []
        },
        error: error.message
      };
    }
  },

  // Suggest relevant subreddits based on niche/industry
  async suggestSubreddits(niche, industry = '', additionalContext = '') {
    try {
      const prompt = `
        Suggest relevant and active subreddits for the following niche/industry:
        Niche: ${niche}
        ${industry ? `Industry: ${industry}` : ''}
        ${additionalContext ? `Additional context: ${additionalContext}` : ''}
        
        Please suggest subreddits that would be valuable for:
        1. Market research
        2. Customer feedback
        3. Industry trends
        4. Community engagement
        5. Competitive intelligence
        
        Respond in JSON format:
        {
          "suggestions": [
            {
              "name": "subreddit_name",
              "reason": "Why this subreddit is relevant",
              "category": "primary|secondary|niche",
              "estimated_size": "large|medium|small",
              "activity_level": "very_high|high|medium|low",
              "relevance_score": 0.85
            }
          ],
          "search_keywords": ["keywords", "to", "search", "for", "more"],
          "related_niches": ["related", "niches", "to", "explore"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a Reddit expert who knows the platform\'s communities well. Suggest relevant subreddits for business research and engagement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error suggesting subreddits:', error);
      return {
        data: {
          suggestions: [],
          search_keywords: [],
          related_niches: []
        },
        error: error.message
      };
    }
  },

  // Generate keyword suggestions for tracking
  async suggestKeywords(niche, subreddits = [], context = '') {
    try {
      const prompt = `
        Generate relevant keywords to track for the following niche and subreddits:
        Niche: ${niche}
        ${subreddits.length > 0 ? `Subreddits: ${subreddits.join(', ')}` : ''}
        ${context ? `Context: ${context}` : ''}
        
        Please suggest keywords that would help track:
        1. Customer pain points
        2. Feature requests
        3. Competitor mentions
        4. Industry trends
        5. User sentiment
        
        Respond in JSON format:
        {
          "keywords": [
            {
              "keyword": "keyword or phrase",
              "category": "pain_point|feature_request|competitor|trend|sentiment",
              "priority": "high|medium|low",
              "expected_volume": "high|medium|low",
              "sentiment_focus": "positive|negative|neutral|all"
            }
          ],
          "phrases": [
            {
              "phrase": "multi-word phrase to track",
              "category": "pain_point|feature_request|competitor|trend|sentiment",
              "priority": "high|medium|low"
            }
          ],
          "negative_keywords": ["keywords", "to", "exclude", "from", "tracking"]
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a keyword research expert specializing in social media monitoring. Generate relevant keywords for tracking business-relevant discussions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 600
      });

      const result = JSON.parse(response.choices[0].message.content);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error suggesting keywords:', error);
      return {
        data: {
          keywords: [],
          phrases: [],
          negative_keywords: []
        },
        error: error.message
      };
    }
  }
};

export default openaiService;
