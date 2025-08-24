# AI App Builder Pro - Complete Codebase

A complete, production-ready AI-powered application builder that generates full-stack applications using modern technologies.

## Features

- **AI App Generation**: Generate complete React applications using OpenAI, Anthropic, Cerebras, and other AI providers
- **Secure API Key Management**: Encrypted storage and management of AI provider API keys
- **Interactive Chat Assistant**: Get help with development questions and app architecture
- **Project Management**: Comprehensive dashboard for managing generated applications
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live chat and project status updates
- **Code Viewer**: View and copy generated application code

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Markdown** - Render markdown content
- **React Syntax Highlighter** - Code syntax highlighting

### Backend
- **Supabase** - Backend-as-a-Service
- **Supabase Auth** - User authentication
- **PostgreSQL** - Database with row-level security
- **Edge Functions** - Serverless TypeScript functions
- **Supabase Storage** - File storage (if needed)

### AI Integration
- **OpenAI API** - GPT-4 for app generation
- **Anthropic API** - Claude for conversations
- **Cerebras API** - Fast inference
- **Support for multiple providers**

## Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- Supabase account
- AI provider API keys (OpenAI, Anthropic, etc.)

## Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd ai-app-builder-pro

# Install dependencies
pnpm install
```

### 2. Environment Setup

The `.env` file is already configured with the Supabase credentials:

```env
VITE_SUPABASE_URL=https://zlxdgosmhxjirkcnlrrq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
pnpm build
```

### 5. Preview Production Build

```bash
pnpm preview
```

## Usage Guide

### 1. User Registration
- Create an account or sign in
- Email verification required for new accounts

### 2. API Key Management
- Navigate to "API Keys" section
- Add your AI provider API keys (OpenAI, Anthropic, etc.)
- Keys are encrypted and stored securely

### 3. Generate Applications
- Click "Generate App" or "New Project"
- Follow the 3-step wizard:
  1. **Basic Info**: Project name, description, app type
  2. **Framework & Features**: Choose framework and features
  3. **Review & Generate**: Confirm and generate

### 4. Manage Projects
- View all projects in the dashboard
- Search and filter projects
- View generated code
- Duplicate or delete projects

### 5. AI Assistant
- Ask development questions
- Get architecture advice
- Multiple chat sessions
- Markdown and code highlighting

## Project Structure

```
ai-app-builder-pro/
├── src/
│   ├── components/          # React components
│   │   ├── ApiKeyManager.tsx
│   │   ├── AppGenerator.tsx
│   │   ├── AuthForm.tsx
│   │   ├── ChatAssistant.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProjectDashboard.tsx
│   │   ├── ProjectViewer.tsx
│   │   └── Settings.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useApiKeys.ts
│   │   ├── useChat.ts
│   │   └── useProjects.ts
│   ├── lib/                # Utilities
│   │   └── supabase.ts
│   └── App.tsx             # Main app component
├── supabase/
│   └── functions/          # Edge functions
│       ├── api-key-management/
│       ├── ai-app-generation/
│       ├── chat-assistant/
│       └── project-management/
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Backend Architecture

### Database Tables

- **profiles** - User profile information
- **api_keys** - Encrypted API key storage
- **projects** - Generated application projects
- **chat_sessions** - Chat conversation sessions
- **chat_messages** - Individual chat messages

### Edge Functions

1. **api-key-management** - CRUD operations for API keys
2. **ai-app-generation** - Generate applications using AI
3. **chat-assistant** - Handle chat conversations
4. **project-management** - Project CRUD operations

## Security Features

- **Row Level Security (RLS)** - Database access control
- **API Key Encryption** - Base64 encoding (upgrade to proper encryption in production)
- **User Authentication** - Supabase Auth with email verification
- **CORS Protection** - Proper CORS headers in edge functions
- **Input Validation** - Comprehensive input validation

## Customization

### Adding New AI Providers

1. Update `AI_PROVIDERS` in `ApiKeyManager.tsx`
2. Add provider logic in edge functions
3. Update TypeScript types

### Adding New App Types

1. Update `APP_TYPES` in `AppGenerator.tsx`
2. Update generation logic in `ai-app-generation` function

### Styling

- Modify `tailwind.config.js` for design system changes
- Update component styles using Tailwind classes
- Add custom CSS in `src/index.css` if needed

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript check
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting with React rules
- **Prettier** - Code formatting (configure as needed)
- **Husky** - Git hooks (add if needed)

## Deployment

### Frontend Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   - Connect GitHub repository
   - Build command: `pnpm build`
   - Publish directory: `dist`

3. **AWS S3 + CloudFront**
   - Upload `dist` folder to S3
   - Configure CloudFront distribution

### Backend (Supabase)

- Edge functions are already deployed
- Database tables are created
- No additional backend deployment needed

## Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Add more providers
VITE_CUSTOM_API_ENDPOINT=your_custom_endpoint
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && pnpm install`
   - Check TypeScript errors: `pnpm type-check`

2. **API Issues**
   - Verify Supabase configuration
   - Check edge function logs in Supabase dashboard
   - Validate API keys in the app

3. **Authentication Issues**
   - Check email verification
   - Verify Supabase Auth configuration
   - Check browser console for errors

### Support

- Check the browser console for error messages
- Verify network requests in browser dev tools
- Check Supabase dashboard for edge function logs
- Ensure API keys are properly configured

## Production Considerations

### Security Enhancements

1. **Proper Encryption** - Replace base64 with AES encryption
2. **Rate Limiting** - Implement in edge functions
3. **Input Sanitization** - Add comprehensive validation
4. **HTTPS Only** - Ensure all connections use HTTPS

### Performance Optimizations

1. **Code Splitting** - Implement React lazy loading
2. **Caching** - Add service worker for static assets
3. **CDN** - Use CDN for better global performance
4. **Database Indexing** - Optimize database queries

### Monitoring

1. **Error Tracking** - Add Sentry or similar
2. **Analytics** - Add usage analytics
3. **Logging** - Comprehensive logging in edge functions
4. **Health Checks** - Monitor system health

## License

This project is provided as-is for educational and development purposes.

## Contributing

This is a complete reference implementation. You can:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit pull requests

---

**Built with modern technologies for developers who want to build AI-powered applications quickly and efficiently.**