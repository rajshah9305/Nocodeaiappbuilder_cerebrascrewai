import React, { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/AuthForm'
import { Navigation } from '@/components/Navigation'
import { ProjectDashboard } from '@/components/ProjectDashboard'
import { AppGenerator } from '@/components/AppGenerator'
import { ChatAssistant } from '@/components/ChatAssistant'
import { ApiKeyManager } from '@/components/ApiKeyManager'
import { ProjectViewer } from '@/components/ProjectViewer'
import { Settings } from '@/components/Settings'
import type { Project } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

function AppContent() {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onModeChange={setAuthMode} 
      />
    )
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView('project-view')
  }

  const handleNewProject = () => {
    setCurrentView('generate')
  }

  const handleProjectGenerated = (projectId: string) => {
    setCurrentView('dashboard')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <ProjectDashboard 
            onNewProject={handleNewProject}
            onViewProject={handleViewProject}
          />
        )
      case 'generate':
        return (
          <AppGenerator onGenerated={handleProjectGenerated} />
        )
      case 'chat':
        return <ChatAssistant />
      case 'api-keys':
        return <ApiKeyManager />
      case 'project-view':
        return (
          <ProjectViewer 
            project={selectedProject}
            onBack={() => setCurrentView('dashboard')}
          />
        )
      case 'settings':
        return <Settings />
      default:
        return (
          <ProjectDashboard 
            onNewProject={handleNewProject}
            onViewProject={handleViewProject}
          />
        )
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className={`flex-1 overflow-auto ${
          currentView === 'chat' ? '' : 'p-6'
        }`}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App