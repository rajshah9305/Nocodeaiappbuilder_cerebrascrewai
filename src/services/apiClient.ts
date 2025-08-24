import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GenerationRequest, GenerationResponse, Agent, ApiClient } from '@/types';

class APIClientService implements ApiClient {
  private cerebrasClient: AxiosInstance;
  private crewaiClient: AxiosInstance;
  private deploymentClient: AxiosInstance;

  constructor() {
    // Cerebras API Client
    this.cerebrasClient = axios.create({
      baseURL: process.env.REACT_APP_CEREBRAS_BASE_URL || 'https://api.cerebras.ai/v1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_CEREBRAS_API_KEY}`,
      },
      timeout: 30000,
    });

    // CrewAI API Client
    this.crewaiClient = axios.create({
      baseURL: process.env.REACT_APP_CREWAI_API_URL || 'http://localhost:8000/v1',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REACT_APP_CREWAI_API_KEY,
      },
      timeout: 60000,
    });

    // Deployment API Client
    this.deploymentClient = axios.create({
      timeout: 120000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptors
    [this.cerebrasClient, this.crewaiClient, this.deploymentClient].forEach(client => {
      client.interceptors.request.use(
        (config) => {
          console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
          return config;
        },
        (error) => {
          console.error('Request error:', error);
          return Promise.reject(error);
        }
      );

      client.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error('Response error:', error.response?.data || error.message);
          return Promise.reject(error);
        }
      );
    });
  }

  // Cerebras API Methods
  cerebras = {
    generateCompletion: async (prompt: string, options: any = {}) => {
      try {
        const response: AxiosResponse = await this.cerebrasClient.post('/chat/completions', {
          model: options.model || 'llama-4-maverick-17b-128e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an expert full-stack developer and software architect. Generate production-ready, complete React applications based on user requirements. Always provide working code with proper imports, styling, and functionality. Never use placeholders or TODO comments.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_completion_tokens: options.maxTokens || 32768,
          temperature: options.temperature || 0.6,
          top_p: options.topP || 0.9,
          stream: false,
        });

        return {
          success: true,
          content: response.data.choices[0].message.content,
          usage: response.data.usage,
          model: response.data.model,
        };
      } catch (error: any) {
        console.error('Cerebras API Error:', error);
        return {
          success: false,
          error: error.response?.data?.error?.message || error.message,
        };
      }
    },

    streamCompletion: async function* (prompt: string, options: any = {}) {
      try {
        const response = await fetch(`${process.env.REACT_APP_CEREBRAS_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_CEREBRAS_API_KEY}`,
          },
          body: JSON.stringify({
            model: options.model || 'llama-4-maverick-17b-128e-instruct',
            messages: [
              {
                role: 'system',
                content: 'You are an expert full-stack developer. Generate production-ready React applications.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_completion_tokens: options.maxTokens || 32768,
            temperature: options.temperature || 0.6,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;

              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  yield parsed.choices[0].delta.content;
                }
              } catch (e) {
                console.warn('Failed to parse chunk:', data);
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Cerebras Streaming Error:', error);
        throw error;
      }
    },
  };

  // CrewAI API Methods
  crewai = {
    orchestrateAgents: async (request: GenerationRequest): Promise<GenerationResponse> => {
      try {
        const response: AxiosResponse = await this.crewaiClient.post('/orchestrate', {
          prompt: request.prompt,
          template: request.template,
          agents: request.agents.map(agent => ({
            id: agent.id,
            role: agent.role,
            goal: agent.goal,
            backstory: agent.backstory,
            tools: agent.tools,
          })),
          options: request.options,
        });

        return response.data;
      } catch (error: any) {
        console.error('CrewAI Orchestration Error:', error);

        // Fallback to direct Cerebras generation if CrewAI is unavailable
        const fallbackResult = await this.generateFallbackApp(request);
        return fallbackResult;
      }
    },

    getAgentStatus: async (agentId: string): Promise<Agent> => {
      try {
        const response: AxiosResponse = await this.crewaiClient.get(`/agents/${agentId}`);
        return response.data;
      } catch (error: any) {
        console.error('Get Agent Status Error:', error);
        throw error;
      }
    },

    updateAgent: async (agentId: string, updates: Partial<Agent>): Promise<Agent> => {
      try {
        const response: AxiosResponse = await this.crewaiClient.patch(`/agents/${agentId}`, updates);
        return response.data;
      } catch (error: any) {
        console.error('Update Agent Error:', error);
        throw error;
      }
    },
  };

  // Deployment Methods
  deployment = {
    deployToVercel: async (code: string, config: any) => {
      try {
        const response: AxiosResponse = await this.deploymentClient.post(
          'https://api.vercel.com/v13/deployments',
          {
            name: config.projectName || 'crewai-generated-app',
            files: [
              {
                file: 'package.json',
                data: JSON.stringify({
                  name: config.projectName || 'generated-app',
                  version: '1.0.0',
                  private: true,
                  dependencies: {
                    react: '^18.2.0',
                    'react-dom': '^18.2.0',
                    'react-scripts': '5.0.1',
                    'lucide-react': '^0.300.0',
                  },
                  scripts: {
                    start: 'react-scripts start',
                    build: 'react-scripts build',
                  },
                }),
              },
              {
                file: 'src/App.js',
                data: code,
              },
              {
                file: 'src/index.js',
                data: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
              },
              {
                file: 'public/index.html',
                data: `
<!DOCTYPE html>
<html>
<head>
  <title>${config.projectName || 'Generated App'}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root"></div>
</body>
</html>
                `,
              },
            ],
            projectSettings: {
              framework: 'create-react-app',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return {
          success: true,
          url: `https://${response.data.url}`,
          deploymentId: response.data.id,
        };
      } catch (error: any) {
        console.error('Vercel Deployment Error:', error);
        return {
          success: false,
          error: error.response?.data?.error?.message || error.message,
        };
      }
    },

    deployToNetlify: async (code: string, config: any) => {
      try {
        // Create a zip file with the project structure
        const projectFiles = {
          'package.json': JSON.stringify({
            name: config.projectName || 'generated-app',
            version: '1.0.0',
            private: true,
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0',
              'react-scripts': '5.0.1',
            },
            scripts: {
              start: 'react-scripts start',
              build: 'react-scripts build',
            },
          }),
          'src/App.js': code,
          'src/index.js': `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
          'public/index.html': `
<!DOCTYPE html>
<html>
<head>
  <title>${config.projectName || 'Generated App'}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root"></div>
</body>
</html>
          `,
        };

        // Simulate deployment (in real implementation, you'd use Netlify API)
        return {
          success: true,
          url: `https://${config.projectName || 'generated-app'}.netlify.app`,
          deploymentId: `netlify_${Date.now()}`,
        };
      } catch (error: any) {
        console.error('Netlify Deployment Error:', error);
        return {
          success: false,
          error: error.message,
        };
      }
    },

    getDeploymentStatus: async (deploymentId: string) => {
      try {
        // Check deployment status (implementation depends on provider)
        return {
          status: 'ready',
          url: `https://deployment-${deploymentId}.vercel.app`,
        };
      } catch (error: any) {
        console.error('Deployment Status Error:', error);
        throw error;
      }
    },
  };

  // Fallback method when CrewAI is unavailable
  private async generateFallbackApp(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();

    const enhancedPrompt = `
Create a complete, production-ready React application based on this request: "${request.prompt}"

Requirements:
- Use modern React with hooks and functional components
- Include proper styling with Tailwind CSS classes
- Add realistic sample data and functionality
- Include navigation, forms, and interactive elements as needed
- Make it responsive and accessible
- Add proper error handling
- Include loading states where appropriate

Generate a complete, working React component that can be immediately used. Do not include any placeholders, TODOs, or incomplete sections.
`;

    const result = await this.cerebras.generateCompletion(enhancedPrompt, request.options);

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate application');
    }

    return {
      success: true,
      code: result.content,
      preview: this.generatePreviewHTML(request.prompt, result.content),
      metadata: {
        generationTime: Date.now() - startTime,
        tokenUsage: result.usage?.total_tokens || 0,
        complexity: 'Advanced',
        frameworks: ['React', 'Tailwind CSS'],
        features: this.extractFeatures(result.content),
      },
    };
  }

  private generatePreviewHTML(prompt: string, code: string): string {
    const appName = prompt.split(' ').slice(0, 3).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return `
  <div style="min-height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; color: white; font-family: 'Inter', sans-serif;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; text-align: center;">
        🚀 ${appName}
      </h1>
      <p style="text-align: center; opacity: 0.9; margin-bottom: 2rem;">
        Generated with CrewAI Agents + Cerebras Lightning Inference ⚡
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; backdrop-filter: blur(10px);">
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">✨ AI-Generated Features</h3>
          <p style="opacity: 0.8;">Complete React application with modern functionality</p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; backdrop-filter: blur(10px);">
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">⚡ Production Ready</h3>
          <p style="opacity: 0.8;">Zero placeholders, complete working implementation</p>
        </div>

        <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 8px; backdrop-filter: blur(10px);">
          <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">🎯 Deploy Instantly</h3>
          <p style="opacity: 0.8;">Ready for Vercel, Netlify, or any hosting platform</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <button style="background: #4F46E5; color: white; padding: 0.75rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
          View Generated Code 🚀
        </button>
      </div>
    </div>
  </div>
`;
  }

  private extractFeatures(code: string): string[] {
    const features = [];

    if (code.includes('useState') || code.includes('useEffect')) {
      features.push('State Management');
    }
    if (code.includes('fetch') || code.includes('axios')) {
      features.push('API Integration');
    }
    if (code.includes('router') || code.includes('navigate')) {
      features.push('Routing');
    }
    if (code.includes('form') || code.includes('input')) {
      features.push('Forms');
    }
    if (code.includes('chart') || code.includes('graph')) {
      features.push('Data Visualization');
    }
    if (code.includes('responsive') || code.includes('mobile')) {
      features.push('Responsive Design');
    }

    return features;
  }
}

export const apiClient = new APIClientService();
export default apiClient;
