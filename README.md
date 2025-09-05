# Reddit Pulse

**Unlock curated Reddit insights for your niche**

Reddit Pulse is a comprehensive web application that helps users identify relevant subreddits, track keywords and sentiment, and extract key pain points and trends from Reddit discussions for business research and product development.

![Reddit Pulse Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Reddit+Pulse+Dashboard)

## 🚀 Features

### Core Features
- **🔍 Niche Subreddit Finder**: Discover relevant and active subreddits based on community size, activity, and content relevance
- **📊 Keyword & Sentiment Tracker**: Monitor specific keywords, phrases, and brand mentions across identified subreddits with sentiment analysis
- **🧠 AI-Powered Insights**: Generate actionable business insights from Reddit discussions using OpenAI
- **📈 Trend Analysis**: Identify emerging trends and pain points in your industry
- **🎯 Pain Point Identification**: Extract common user concerns and feature requests

### Technical Features
- **🔐 Secure Authentication**: Supabase-powered user authentication and authorization
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **⚡ Real-time Updates**: Live data synchronization with Supabase
- **🛡️ Rate Limiting**: Built-in API rate limiting for Reddit and OpenAI APIs
- **💾 Data Persistence**: Comprehensive database schema with PostgreSQL
- **🎨 Modern UI**: Clean, intuitive interface with Lucide React icons

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Elegant toast notifications
- **React Hook Form** - Performant forms with easy validation
- **Recharts** - Composable charting library

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **PostgreSQL** - Robust relational database
- **OpenAI API** - AI-powered sentiment analysis and insights
- **Reddit API** - Access to Reddit's public data

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

You'll also need accounts and API keys for:
- **Supabase** (free tier available)
- **OpenAI** (API key required)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/reddit-pulse.git
cd reddit-pulse
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy the environment template and fill in your API keys:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# App Configuration
VITE_APP_NAME=Reddit Pulse
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 4. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies (included in schema)

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application running.

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - User profiles and subscription information
- **monitored_subreddits** - User's tracked subreddits
- **tracked_keywords** - Keywords being monitored
- **insights** - AI-generated insights and trends
- **reddit_posts** - Cached Reddit posts for analysis
- **reddit_comments** - Cached Reddit comments
- **sentiment_analysis** - Sentiment analysis results
- **user_activity_log** - User activity tracking
- **api_usage** - API usage tracking for billing

## 🔧 Configuration

### Supabase Setup
1. Create a new project in Supabase
2. Copy your project URL and anon key to `.env`
3. Run the SQL schema from `database/schema.sql`
4. Configure authentication providers if needed

### OpenAI Setup
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add the key to your `.env` file
3. Monitor usage in the OpenAI dashboard

### Reddit API (Optional)
For higher rate limits, you can register a Reddit application:
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new application
3. Add credentials to `.env` (optional)

## 🏗️ Project Structure

```
reddit-pulse/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── SubredditFinder.jsx
│   │   ├── KeywordTracker.jsx
│   │   └── InsightsSummary.jsx
│   ├── context/            # React context providers
│   ├── services/           # API services
│   │   ├── supabase.js     # Supabase client and functions
│   │   ├── redditApi.js    # Reddit API integration
│   │   └── openaiService.js # OpenAI API integration
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── database/
│   └── schema.sql          # Complete database schema
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🎯 Usage Guide

### Getting Started
1. **Sign Up**: Create an account or sign in
2. **Find Subreddits**: Use the Subreddit Finder to discover relevant communities
3. **Add Keywords**: Set up keyword tracking for your niche
4. **Generate Insights**: Let AI analyze discussions and generate insights
5. **Monitor Trends**: Track sentiment and emerging trends over time

### Key Workflows

#### Subreddit Discovery
1. Enter your niche or industry in the search box
2. Browse AI-suggested subreddits
3. Add relevant subreddits to your monitoring list
4. View community statistics and activity levels

#### Keyword Tracking
1. Add keywords related to your business or interests
2. Set sentiment thresholds for alerts
3. Associate keywords with specific subreddits
4. Monitor keyword performance over time

#### Insight Generation
1. Select subreddits and keywords to analyze
2. Generate AI-powered insights and trends
3. Review pain points and opportunities
4. Export insights for further analysis

## 🔒 Security & Privacy

- **Row Level Security**: Database access is restricted by user
- **API Key Security**: All API keys are stored securely
- **Data Privacy**: User data is never shared with third parties
- **HTTPS Only**: All communications are encrypted
- **Rate Limiting**: Built-in protection against API abuse

## 📈 Subscription Tiers

### Free Tier
- 5 monitored subreddits
- 10 tracked keywords
- 50 insights per month
- Basic sentiment analysis

### Basic Tier ($15/month)
- 25 monitored subreddits
- 50 tracked keywords
- 500 insights per month
- Advanced sentiment analysis
- Export capabilities

### Pro Tier ($45/month)
- Unlimited subreddits
- Unlimited keywords
- Unlimited insights
- Real-time monitoring
- API access
- Priority support

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs on [GitHub Issues](https://github.com/vistara-apps/reddit-pulse/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/vistara-apps/reddit-pulse/discussions)
- **Email**: Contact us at support@redditpulse.com

## 🙏 Acknowledgments

- **Reddit** for providing public API access
- **OpenAI** for powerful AI capabilities
- **Supabase** for excellent backend services
- **Tailwind CSS** for beautiful styling
- **React** community for amazing tools and libraries

## 📊 Roadmap

### Version 1.1
- [ ] Advanced filtering and search
- [ ] Custom dashboard widgets
- [ ] Email notifications
- [ ] Data export (CSV, JSON)

### Version 1.2
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Webhook integrations
- [ ] Mobile app (React Native)

### Version 2.0
- [ ] Multi-platform support (Twitter, Discord)
- [ ] Machine learning insights
- [ ] Custom AI models
- [ ] Enterprise features

---

**Made with ❤️ by the Reddit Pulse Team**

*Unlock the power of Reddit for your business intelligence needs.*
