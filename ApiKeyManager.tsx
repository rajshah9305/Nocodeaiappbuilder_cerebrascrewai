import React, { useState, useEffect } from 'react'
import { Plus, Key, Trash2, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react'
import { useApiKeys } from '@/hooks/useApiKeys'
import type { ApiKey } from '@/lib/supabase'

const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT models for text generation' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude models for conversations' },
  { id: 'cerebras', name: 'Cerebras', description: 'Fast inference at scale' },
  { id: 'gemini', name: 'Google Gemini', description: 'Multimodal AI capabilities' },
  { id: 'cohere', name: 'Cohere', description: 'Language models for enterprises' }
]

export function ApiKeyManager() {
  const { addApiKey, deleteApiKey, listApiKeys, loading } = useApiKeys()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    provider: '',
    keyName: '',
    apiKey: ''
  })
  const [showKey, setShowKey] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const keys = await listApiKeys()
      setApiKeys(keys)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await addApiKey({
        provider: formData.provider,
        apiKey: formData.apiKey,
        keyName: formData.keyName
      })
      setFormData({ provider: '', keyName: '', apiKey: '' })
      setShowForm(false)
      loadApiKeys()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleDelete = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      await deleteApiKey(keyId)
      loadApiKeys()
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
          <p className="text-gray-600 mt-1">
            Manage your AI provider API keys securely
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add API Key
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New API Key</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a provider</option>
                {AI_PROVIDERS.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={formData.keyName}
                onChange={(e) => setFormData(prev => ({ ...prev, keyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., My OpenAI Key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your API key"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Key
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {apiKeys.map(key => {
          const provider = AI_PROVIDERS.find(p => p.id === key.service_id)
          const isKeyVisible = showKey === key.id

          return (
            <div
              key={key.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {key.service_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {provider?.name || key.service_id} • Added {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    key.status === 'connected'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center">
                      {key.status === 'connected' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {key.status}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowKey(isKeyVisible ? null : key.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title={isKeyVisible ? 'Hide key' : 'Show key'}
                  >
                    {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(key.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Delete key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isKeyVisible && key.encrypted_key && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">API Key:</p>
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {atob(key.encrypted_key)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {apiKeys.length === 0 && !loading && (
        <div className="text-center py-12">
          <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
          <p className="text-gray-600 mb-4">
            Add your first AI provider API key to start building applications.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add API Key
          </button>
        </div>
      )}
    </div>
  )
}