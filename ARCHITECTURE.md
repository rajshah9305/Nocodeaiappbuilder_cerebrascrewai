# AI App Builder Pro - System Architecture

## Overview

AI App Builder Pro is a full-stack application that leverages AI to generate complete web applications. The system follows a modern, scalable architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   AI Providers  │
│   (React/TS)    │◄──►│   Backend        │◄──►│   (OpenAI, etc) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   └── AuthForm (if not authenticated)
│   └── Navigation + Main Content (if authenticated)
│       ├── ProjectDashboard
│       ├── AppGenerator
│       ├── ChatAssistant
│       ├── ApiKeyManager
│       ├── ProjectViewer
│       └── Settings
```

### State Management

- **Authentication State**: React Context (`AuthContext`)
- **Component State**: React hooks (`useState`, `useEffect`)
- **API State**: Custom hooks with built-in loading/error states
- **No global state library** - Context + hooks pattern is sufficient

### Data Flow

```
User Interaction → Component → Custom Hook → Supabase Client → Edge Function → AI API
                                    ↓
UI Update ← Component ← Custom Hook ← Response ← Edge Function ← AI Response
```

### Custom Hooks

1. **useAuth** - Authentication state and methods
2. **useApiKeys** - API key management
3. **useProjects** - Project CRUD operations
4. **useChat** - Chat functionality

## Backend Architecture

### Supabase Services

```
┌─────────────────┐
│   PostgreSQL    │ - Data storage with RLS
├─────────────────┤
│   Auth Service  │ - User authentication
├─────────────────┤
│  Edge Functions │ - Serverless API endpoints
├─────────────────┤
│    Storage      │ - File storage (optional)
└─────────────────┘
```

### Database Schema

#### Core Tables

```sql
-- User profiles
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_id UUID NOT NULL,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- API key storage
api_keys (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id TEXT NOT NULL, -- 'openai', 'anthropic', etc.
  service_name TEXT NOT NULL,
  encrypted_key TEXT,
  status TEXT DEFAULT 'disconnected',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Generated projects
projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  framework TEXT,
  complexity TEXT DEFAULT 'medium',
  tech_stack JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  frontend_code JSONB,
  backend_code JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Chat sessions
chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID,
  session_name TEXT DEFAULT 'New Chat',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Chat messages
chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_order INTEGER NOT NULL,
  created_at TIMESTAMP
);
```

### Edge Functions

#### 1. api-key-management

**Purpose**: Secure API key CRUD operations

**Endpoints**:
- `POST /functions/v1/api-key-management`

**Actions**:
- `add` - Add new API key
- `update` - Update existing key
- `list` - Get user's keys (encrypted keys hidden)
- `delete` - Remove API key

**Security**: User authentication required, keys are base64 encoded

#### 2. ai-app-generation

**Purpose**: Generate complete applications using AI

**Endpoints**:
- `POST /functions/v1/ai-app-generation`

**Process**:
1. Validate user authentication
2. Retrieve user's AI provider key
3. Create project record with 'generating' status
4. Send structured prompt to AI API
5. Parse AI response into code structure
6. Update project with generated code
7. Return project ID and status

**AI Integration**: Supports multiple providers with provider-specific logic

#### 3. chat-assistant

**Purpose**: AI-powered development assistance

**Endpoints**:
- `POST /functions/v1/chat-assistant`

**Actions**:
- `send_message` - Send message and get AI response
- `get_sessions` - Get user's chat sessions
- `get_messages` - Get messages for a session

**Features**:
- Session management
- Message history for context
- Multiple AI provider support

#### 4. project-management

**Purpose**: Project CRUD operations

**Endpoints**:
- `POST /functions/v1/project-management`

**Actions**:
- `create` - Create new project
- `list` - Get user's projects
- `get` - Get single project
- `update` - Update project
- `delete` - Delete project
- `duplicate` - Create copy of project
- `stats` - Get project statistics

## Security Architecture

### Authentication Flow

```
1. User signs up/in → Supabase Auth
2. Auth returns JWT token
3. Token stored in browser
4. Token sent with each API request
5. Edge functions validate token
6. Database RLS enforces user isolation
```

### Data Security

1. **Row Level Security (RLS)**
   - All tables have RLS policies
   - Users can only access their own data
   - Enforced at database level

2. **API Key Protection**
   - Keys encrypted before storage
   - Never returned in plain text
   - Only used server-side in edge functions

3. **Input Validation**
   - Client-side validation for UX
   - Server-side validation for security
   - Type checking with TypeScript

### CORS Configuration

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};
```

## AI Integration Architecture

### Provider Abstraction

```typescript
interface AIProvider {
  generateApp(prompt: string, apiKey: string): Promise<GeneratedApp>
  chatCompletion(messages: Message[], apiKey: string): Promise<string>
}
```

### Supported Providers

1. **OpenAI**
   - Model: GPT-4
   - Usage: App generation, chat
   - Rate limits: Provider-dependent

2. **Anthropic**
   - Model: Claude
   - Usage: Chat, code review
   - Context: Long context windows

3. **Cerebras**
   - Usage: Fast inference
   - Specialization: Speed-optimized

### Error Handling

```typescript
try {
  const result = await aiProvider.generate(prompt, apiKey)
  return result
} catch (error) {
  if (error.status === 401) {
    throw new Error('Invalid API key')
  } else if (error.status === 429) {
    throw new Error('Rate limit exceeded')
  } else {
    throw new Error('AI service unavailable')
  }
}
```

## Performance Considerations

### Frontend Optimizations

1. **Code Splitting**
   - Lazy load components
   - Route-based splitting
   - Dynamic imports for heavy libraries

2. **Caching**
   - API response caching
   - Image optimization
   - Service worker for offline support

3. **Bundle Size**
   - Tree shaking
   - Modern build tools (Vite)
   - Minimal dependencies

### Backend Optimizations

1. **Database**
   - Proper indexing on query columns
   - Connection pooling
   - Query optimization

2. **Edge Functions**
   - Keep functions lightweight
   - Minimize cold start time
   - Efficient error handling

3. **API Calls**
   - Request batching where possible
   - Timeout configurations
   - Retry logic with exponential backoff

## Scalability Architecture

### Horizontal Scaling

1. **Frontend**
   - CDN distribution
   - Multiple deployment regions
   - Load balancing

2. **Backend**
   - Supabase handles scaling automatically
   - Edge functions scale on demand
   - Database read replicas for read-heavy workloads

### Monitoring & Observability

1. **Metrics**
   - User engagement
   - API response times
   - Error rates
   - AI provider usage

2. **Logging**
   - Structured logging in edge functions
   - Error tracking and alerting
   - Performance monitoring

## Future Enhancements

### Technical Roadmap

1. **Real-time Features**
   - Live collaboration on projects
   - Real-time chat updates
   - Project status notifications

2. **Advanced AI Features**
   - Multi-step app generation
   - Code refinement iterations
   - Custom model fine-tuning

3. **Developer Experience**
   - VS Code extension
   - CLI tool for local development
   - Git integration

4. **Enterprise Features**
   - Team collaboration
   - Role-based access control
   - Audit logging
   - Custom deployment targets

---

This architecture provides a solid foundation for a production-grade AI application builder while maintaining flexibility for future enhancements and scaling requirements.