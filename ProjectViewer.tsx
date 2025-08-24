import React from 'react'
import { ArrowLeft, Code, Download, ExternalLink, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Project } from '@/lib/supabase'
import { useState } from 'react'

interface ProjectViewerProps {
  project: Project | null
  onBack: () => void
}

export function ProjectViewer({ project, onBack }: ProjectViewerProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No project selected</p>
      </div>
    )
  }

  const handleCopyCode = async (code: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedFile(fileName)
      setTimeout(() => setCopiedFile(null), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const getFileExtension = (path: string) => {
    return path.split('.').pop()?.toLowerCase() || 'javascript'
  }

  const generatedCode = project.frontend_code || {}
  const components = generatedCode.components || []
  const pages = generatedCode.pages || []
  const config = generatedCode.config || {}
  const readme = generatedCode.readme || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-800'
              : project.status === 'generating'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Framework</h3>
            <p className="text-gray-600">{project.framework || 'React'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Complexity</h3>
            <p className="text-gray-600 capitalize">{project.complexity}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
            <p className="text-gray-600">{new Date(project.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generated Code */}
      {(components.length > 0 || pages.length > 0 || readme) && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Generated Code
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {readme && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">README.md</h3>
                  <button
                    onClick={() => handleCopyCode(readme, 'README.md')}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedFile === 'README.md' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="markdown"
                    style={tomorrow as any}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: '#f8f9fa'
                    }}
                  >
                    {readme}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {components.map((component: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {component.name} - {component.path}
                  </h3>
                  <button
                    onClick={() => handleCopyCode(component.code, component.name)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedFile === component.name ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language={getFileExtension(component.path)}
                    style={tomorrow as any}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: '#f8f9fa'
                    }}
                  >
                    {component.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}

            {pages.map((page: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {page.name} - {page.path}
                  </h3>
                  <button
                    onClick={() => handleCopyCode(page.code, page.name)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedFile === page.name ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language={getFileExtension(page.path)}
                    style={tomorrow as any}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: '#f8f9fa'
                    }}
                  >
                    {page.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}

            {config.dependencies && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Dependencies</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(config.dependencies, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {project.status !== 'completed' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            {project.status === 'generating'
              ? 'This project is still being generated. Code will appear when generation is complete.'
              : 'No code has been generated for this project yet.'}
          </p>
        </div>
      )}
    </div>
  )
}