export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  status: 'ready' | 'working' | 'completed' | 'error';
  avatar: string;
  expertise: number;
  completedTasks: number;
  lastActivity?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  icon: string;
  estimatedTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  techStack: string[];
  previewUrl?: string;
}

export interface AgentActivity {
  id: string;
  agent: string;
  action: string;
  time: number;
  status: 'in-progress' | 'completed' | 'error';
  duration?: number;
  details?: string;
}

export interface GenerationRequest {
  prompt: string;
  template?: string;
  agents: Agent[];
  options: {
    model: string;
    maxTokens: number;
    temperature: number;
    includeTests: boolean;
    includeDocumentation: boolean;
    deploymentTarget: string;
  };
}

export interface GenerationResponse {
  success: boolean;
  code: string;
  preview: string;
  metadata: {
    generationTime: number;
    tokenUsage: number;
    complexity: string;
    frameworks: string[];
    features: string[];
  };
  error?: string;
  deploymentUrl?: string;
}

export interface ApiClient {
  cerebras: {
    generateCompletion: (prompt: string, options?: any) => Promise<any>;
    streamCompletion: (prompt: string, options?: any) => AsyncIterable<any>;
  };
  crewai: {
    orchestrateAgents: (request: GenerationRequest) => Promise<GenerationResponse>;
    getAgentStatus: (agentId: string) => Promise<Agent>;
    updateAgent: (agentId: string, updates: Partial<Agent>) => Promise<Agent>;
  };
  deployment: {
    deployToVercel: (code: string, config: any) => Promise<{ url: string }>;
    deployToNetlify: (code: string, config: any) => Promise<{ url: string }>;
    getDeploymentStatus: (deploymentId: string) => Promise<any>;
  };
}

export interface AppConfig {
  cerebras: {
    apiKey: string;
    baseUrl: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
  };
  crewai: {
    apiUrl: string;
    apiKey: string;
    defaultAgents: string[];
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    animations: boolean;
    autoSave: boolean;
    realTimePreview: boolean;
  };
  features: {
    analytics: boolean;
    errorReporting: boolean;
    realTime: boolean;
    aiSuggestions: boolean;
  };
}
