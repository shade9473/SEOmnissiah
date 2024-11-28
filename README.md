# SEOmnissiah - Advanced SEO Blog Generator

An intelligent SEO-focused blog generation platform that combines keyword research, content optimization, and monetization strategies.

## Features

- Advanced keyword research using Edward Stern's "Compact Keywords" methodology
- AI-powered content generation and optimization
- SEO performance tracking and analytics
- Multi-platform monetization integration
- Content calendar and scheduling
- Comprehensive SEO audit tools

## Tech Stack

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- API Integrations: OpenAI, SEMrush, Ahrefs (configurable)

## Preview and Deployment

### Option 1: Vercel Deployment (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Set up environment variables in Vercel:
   - Go to your project settings in Vercel dashboard
   - Add the following environment variables:
     - MONGODB_URI
     - JWT_SECRET
     - OPENAI_API_KEY
     - SEMRUSH_API_KEY
     - AHREFS_API_KEY

5. Access your preview deployment:
   - Each push will create a unique preview URL
   - Production deployment will be at your configured domain

### Option 2: Local Development (If needed)
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a .env file with required environment variables
4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Environment Variables

Create a .env file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
SEMRUSH_API_KEY=your_semrush_api_key
AHREFS_API_KEY=your_ahrefs_api_key
```

## License

MIT
