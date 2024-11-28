# KeywordKarnival - SEO Content Generation Platform

A powerful SEO content generation platform that helps content creators research keywords, generate optimized content, and implement effective monetization strategies.

## Features

### Keyword Research
- Free keyword research using Google Trends API and search suggestions
- Competition analysis and search volume metrics
- Related keyword discovery
- Keyword opportunity scoring

### Content Generation
- AI-powered content generation with customizable options
- Multiple content types (blog posts, articles, product descriptions)
- Tone and style customization
- SEO optimization suggestions

### Credit System
- Free credits for new users
- Earn credits through referrals
- Lucky credit system for active users
- Admin credit gifting capabilities

### User Dashboard
- Real-time analytics and performance metrics
- Recent searches history
- Quick access to core features
- Credit balance tracking

## Tech Stack

- **Frontend:**
  - React with Material-UI
  - React Router for navigation
  - Axios for API requests
  - Context API for state management

- **Backend:**
  - Node.js with Express
  - MongoDB with Mongoose
  - JWT authentication
  - Free API integrations (Google Trends, DuckDuckGo)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/KeywordKarnival.git
   cd KeywordKarnival
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client && npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the root directory
   - Copy contents from `.env.example`
   - Update with your configuration values

## Deployment

### Vercel Deployment

1. Fork this repository to your GitHub account

2. Import your repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Follow the setup instructions

3. Configure environment variables in Vercel:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV
   - CLIENT_URL

4. Deploy:
   - Vercel will automatically deploy your application
   - Each push to main will trigger a new deployment

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
