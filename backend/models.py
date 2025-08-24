from pydantic import BaseModel
from typing import List, Optional


class Agent(BaseModel):
    id: str
    name: str
    role: str
    goal: str
    backstory: str
    tools: List[str]
    status: str  # 'ready' | 'working' | 'completed' | 'error'
    avatar: str
    expertise: int
    completedTasks: int
    lastActivity: Optional[str] = None


class GenerationOptions(BaseModel):
    model: str
    maxTokens: int
    temperature: float
    includeTests: bool
    includeDocumentation: bool
    deploymentTarget: str


class GenerationRequest(BaseModel):
    prompt: str
    template: Optional[str] = None
    agents: List[Agent]
    options: GenerationOptions


class GenerationMetadata(BaseModel):
    generationTime: int
    tokenUsage: int
    complexity: str
    frameworks: List[str]
    features: List[str]


class GenerationResponse(BaseModel):
    success: bool
    code: str
    preview: str
    metadata: GenerationMetadata
    error: Optional[str] = None
    deploymentUrl: Optional[str] = None
