import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/lib/supabase'

interface CreateProjectData {
  name: string
  description?: string
  framework?: string
  complexity?: string
  tech_stack?: string[]
  features?: string[]
  requirements?: any
}

interface GenerateAppData {
  projectName: string
  description: string
  appType: string
  framework?: string
  features?: string[]
  requirements?: any
  aiProvider?: string
}

export function useProjects() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = useCallback(async (data: CreateProjectData) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'create',
          projectData: data
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const listProjects = useCallback(async (): Promise<Project[]> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'list'
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data || []
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const getProject = useCallback(async (projectId: string): Promise<Project> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'get',
          projectId
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const generateApp = useCallback(async (data: GenerateAppData) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('ai-app-generation', {
        body: data
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'delete',
          projectId
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const duplicateProject = useCallback(async (projectId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'duplicate',
          projectId
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const getProjectStats = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const { data: result, error } = await supabase.functions.invoke('project-management', {
        body: {
          action: 'stats'
        }
      })

      if (error) throw error
      if (result?.error) throw new Error(result.error.message)

      return result.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    createProject,
    listProjects,
    getProject,
    generateApp,
    deleteProject,
    duplicateProject,
    getProjectStats,
    loading,
    error
  }
}